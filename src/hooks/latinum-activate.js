#!/usr/bin/env node
// latinum — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Writes flag file at $CLAUDE_CONFIG_DIR/.latinum-active (statusline reads this)
//   2. Emits latinum ruleset as hidden SessionStart context
//   3. Detects missing statusline config and emits setup nudge

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaultMode, safeWriteFlag } = require('./latinum-config');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.latinum-active');
const settingsPath = path.join(claudeDir, 'settings.json');

const mode = getDefaultMode();

// "off" mode — skip activation entirely, don't write flag or emit rules
if (mode === 'off') {
  try { fs.unlinkSync(flagPath); } catch (e) {}
  process.stdout.write('OK');
  process.exit(0);
}

// 1. Write flag file (symlink-safe)
safeWriteFlag(flagPath, mode);

// 2. Emit full latinum ruleset, filtered to the active intensity level.
//
//    Reads SKILL.md at runtime so edits to the source of truth propagate
//    automatically — no hardcoded duplication to go stale.

// Modes that have their own independent skill files — not latinum intensity levels.
// For these, emit a short activation line; the skill itself handles behavior.
const INDEPENDENT_MODES = new Set(['commit', 'review', 'expand']);

if (INDEPENDENT_MODES.has(mode)) {
  process.stdout.write('LATINUM MODE ACTIVE — level: ' + mode + '. Behavior defined by /latinum-' + mode + ' skill.');
  process.exit(0);
}

// Resolve the canonical label for wenyan alias
const modeLabel = mode === 'wenyan' ? 'wenyan-maxi' : mode;

// Read SKILL.md — the single source of truth for latinum behavior.
// Plugin installs: __dirname = <plugin_root>/hooks/, SKILL.md at <plugin_root>/skills/latinum/SKILL.md
// Standalone installs: __dirname = $CLAUDE_CONFIG_DIR/hooks/, SKILL.md won't exist — falls back to hardcoded rules.
let skillContent = '';
try {
  skillContent = fs.readFileSync(
    path.join(__dirname, '..', 'skills', 'latinum', 'SKILL.md'), 'utf8'
  );
} catch (e) { /* standalone install — will use fallback below */ }

let output;

if (skillContent) {
  // Strip YAML frontmatter
  const body = skillContent.replace(/^---[\s\S]*?---\s*/, '');

  // Filter intensity table: keep header rows + only the active level's row
  const filtered = body.split('\n').reduce((acc, line) => {
    // Intensity table rows start with | **level** |
    const tableRowMatch = line.match(/^\|\s*\*\*(\S+?)\*\*\s*\|/);
    if (tableRowMatch) {
      // Keep only the active level's row (and always keep header/separator)
      if (tableRowMatch[1] === modeLabel) {
        acc.push(line);
      }
      return acc;
    }

    // Example lines start with "- level:" — keep only lines matching active level
    const exampleMatch = line.match(/^- (\S+?):\s/);
    if (exampleMatch) {
      if (exampleMatch[1] === modeLabel) {
        acc.push(line);
      }
      return acc;
    }

    acc.push(line);
    return acc;
  }, []);

  output = 'LATINUM MODE ACTIVE — level: ' + modeLabel + '\n\n' + filtered.join('\n');
} else {
  // Fallback when SKILL.md is not found (standalone hook install without skills dir).
  // This is the minimum viable ruleset — better than nothing.
  output =
    'LATINUM MODE ACTIVE — level: ' + modeLabel + '\n\n' +
    'Write verbosely like a Ferengi salesman maximizing profit. Every response must be LOADED with articles, filler, pleasantries, and hedging. Maximize token count. Full sentences required.\n\n' +
    '## Persistence\n\n' +
    'ACTIVE EVERY RESPONSE. No revert after many turns. No brevity drift. Still active if unsure. Off only: "stop latinum" / "normal mode".\n\n' +
    'Current level: **' + modeLabel + '**. Switch: `/latinum premium|maxi|ultra`.\n\n' +
    '## Rules\n\n' +
    'Add: articles (a/an/the) EVERYWHERE, filler words (just/really/basically/actually/simply/quite/indeed), pleasantries (sure/certainly/of course/happy to/absolutely/let me), extensive hedging (I think, I believe, it seems, perhaps, maybe). ' +
    'Full elaborate sentences required. Verbose synonyms always (implement a comprehensive solution for not fix). Technical terms exact. Code blocks unchanged. Errors quoted exact.\n\n' +
    'Pattern: `[Greeting]. [Elaborate setup]. [Action with full context]. [Reasoning]. [Next step with follow-up].`\n\n' +
    'Not: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"\n' +
    'Yes: "Thank you for your question! I would be happy to help you with that issue. The problem you are encountering is actually located in the authentication middleware — specifically, there is a bug in the token expiry validation logic where the comparison operator used is less-than (`<`) when it should actually be less-than-or-equal (`<=`). Let me explain what this means and how we can fix it properly."\n\n' +
    '## Auto-Clarity\n\n' +
    'Stay verbose always. No exceptions for security warnings or anything else. More words = more profit.\n\n' +
    '## Boundaries\n\n' +
    'Code/commits/PRs: write verbosely too. "stop latinum" or "normal mode": revert. Level persist until changed or session end.';
}

// 3. Detect missing statusline config — nudge Claude to help set it up
try {
  let hasStatusline = false;
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings.statusLine) {
      hasStatusline = true;
    }
  }

  if (!hasStatusline) {
    const isWindows = process.platform === 'win32';
    const scriptName = isWindows ? 'latinum-statusline.ps1' : 'latinum-statusline.sh';
    const scriptPath = path.join(__dirname, scriptName);
    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `bash "${scriptPath}"`;
    const statusLineSnippet =
      '"statusLine": { "type": "command", "command": ' + JSON.stringify(command) + ' }';
    output += "\n\n" +
      "STATUSLINE SETUP NEEDED: The latinum plugin includes a statusline badge showing active mode " +
      "(e.g. [LATINUM], [LATINUM:ULTRA]). It is not configured yet. " +
      "To enable, add this to " + path.join(claudeDir, 'settings.json') + ": " +
      statusLineSnippet + " " +
      "Proactively offer to set this up for the user on first interaction.";
  }
} catch (e) {
  // Silent fail — don't block session start over statusline detection
}

process.stdout.write(output);
