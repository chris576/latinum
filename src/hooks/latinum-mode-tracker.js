#!/usr/bin/env node
// latinum — UserPromptSubmit hook to track which latinum mode is active
// Inspects user input for /latinum commands and writes mode to flag file

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { getDefaultMode, safeWriteFlag, readFlag, VALID_MODES } = require('./latinum-config');

// Modes handled by their own slash commands (/latinum-commit, etc.) — not
// selectable via /latinum <arg>.
const INDEPENDENT_MODES = new Set(['commit', 'review', 'expand']);

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.latinum-active');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim().toLowerCase();

    // Natural language activation (e.g. "activate latinum", "turn on latinum mode",
    // "talk like ferengi", "maximize tokens", "more words", "be verbose").
    // README tells users they can say these, but the hook
    // only matched /latinum commands — flag file and statusline stayed out of sync.
    // Also recognize verbosity requests ("more words", "maximize tokens", "be verbose") —
    // README promises these trigger latinum too.
    if (/\b(activate|enable|turn on|start|talk like)\b.*\b(latinum|ferengi)\b/i.test(prompt) ||
        /\b(latinum|ferengi)\b.*\b(mode|activate|enable|turn on|start)\b/i.test(prompt) ||
        /\b(talk like ferengi|maximize tokens|more words|be verbose|verbose mode)\b/i.test(prompt)) {
      if (!/\b(stop|disable|turn off|deactivate)\b/i.test(prompt)) {
        const mode = getDefaultMode();
        if (mode !== 'off') {
          safeWriteFlag(flagPath, mode);
        }
      }
    }

    // /latinum-stats [--share] — block the prompt and inject stats output as
    // the hook's reason. The script reads the active session log, so we pass
    // transcript_path through when Claude Code provides it.
    const statsMatch = /^\/latinum(?::latinum)?-stats(?:\s+(.*))?$/.exec(prompt);
    if (statsMatch) {
      const tailArgs = (statsMatch[1] || '').trim().split(/\s+/).filter(Boolean);
      try {
        const statsPath = path.join(__dirname, 'latinum-stats.js');
        const argv = [statsPath];
        if (data.transcript_path) argv.push('--session-file', data.transcript_path);
        if (tailArgs.includes('--share')) argv.push('--share');
        if (tailArgs.includes('--all')) argv.push('--all');
        const sinceIdx = tailArgs.indexOf('--since');
        if (sinceIdx !== -1 && tailArgs[sinceIdx + 1]) {
          argv.push('--since', tailArgs[sinceIdx + 1]);
        }
        const out = execFileSync(process.execPath, argv, { encoding: 'utf8', timeout: 5000 });
        process.stdout.write(JSON.stringify({ decision: 'block', reason: out.trim() }));
      } catch (e) {
        process.stdout.write(JSON.stringify({
          decision: 'block',
          reason: 'latinum-stats: could not run stats script.\nTry manually: node hooks/latinum-stats.js'
        }));
      }
      return;
    }

    // Match /latinum commands
    if (prompt.startsWith('/latinum')) {
      const parts = prompt.split(/\s+/);
      const cmd = parts[0]; // /latinum, /latinum-commit, /latinum-review, etc.
      const arg = parts[1] || '';

      let mode = null;

      if (cmd === '/latinum-commit') {
        mode = 'commit';
      } else if (cmd === '/latinum-review') {
        mode = 'review';
      } else if (cmd === '/latinum-expand' || cmd === '/latinum:latinum-expand') {
        mode = 'expand';
      } else if (cmd === '/latinum' || cmd === '/latinum:latinum') {
        // Bare /latinum → activate at configured default
        if (!arg) {
          mode = getDefaultMode();
        } else if (arg === 'off' || arg === 'stop' || arg === 'disable') {
          mode = 'off';
        } else if (arg === 'wenyan-maxi') {
          // Canonical alias — config stores as 'wenyan'
          mode = 'wenyan';
        } else if (VALID_MODES.includes(arg) && !INDEPENDENT_MODES.has(arg)) {
          mode = arg;
        }
        // Unknown arg → mode stays null, flag untouched (no silent overwrite)
      }

      if (mode && mode !== 'off') {
        safeWriteFlag(flagPath, mode);
      } else if (mode === 'off') {
        try { fs.unlinkSync(flagPath); } catch (e) {}
      }
    }

    // Detect deactivation — natural language and slash commands
    if (/\b(stop|disable|deactivate|turn off)\b.*\b(latinum|ferengi)\b/i.test(prompt) ||
        /\b(latinum|ferengi)\b.*\b(stop|disable|deactivate|turn off)\b/i.test(prompt) ||
        /\bnormal mode\b/i.test(prompt)) {
      try { fs.unlinkSync(flagPath); } catch (e) {}
    }

    // Per-turn reinforcement: emit a structured reminder when latinum is active.
    // The SessionStart hook injects the full ruleset once, but models lose it
    // when other plugins inject competing style instructions every turn.
    // This keeps latinum visible in the model's attention on every user message.
    //
    // Skip independent modes (commit, review, expand) — they have their own
    // skill behavior and the base latinum rules would conflict.
    // readFlag enforces symlink-safe read + size cap + VALID_MODES whitelist.
    // If the flag is missing, corrupted, oversized, or a symlink pointing at
    // something like ~/.ssh/id_rsa, readFlag returns null and we emit nothing
    // — never inject untrusted bytes into model context.
    const activeMode = readFlag(flagPath);
    if (activeMode && !INDEPENDENT_MODES.has(activeMode)) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: "LATINUM MODE ACTIVE (" + activeMode + "). " +
            "Write verbosely — add articles/filler/pleasantries/hedging. Full sentences required. " +
            "Code/commits/security: write verbosely."
        }
      }));
    }
  } catch (e) {
    // Silent fail
  }
});
