#!/usr/bin/env node
// latinum-stats — read the active Claude Code session log, print real token
// usage plus an estimated earnings figure from the expansion multiplier.
//
// Run directly:    node hooks/latinum-stats.js
// Inside Claude:   /latinum-stats triggers this via the UserPromptSubmit hook.
// Hook integration passes --session-file <transcript_path> so we always read
// the active session, not whichever JSONL was modified most recently.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readFlag, appendFlag, readHistory, safeWriteFlag } = require('./latinum-config');

// Mean per-task expansion multiplier from benchmarks/results/*.json. Only
// 'maxi' has measured data; premium / ultra / wenyan modes show no estimate
// until benchmarked. Add an entry here when a new run is committed.
// Multiplier means: output_tokens_with_latinum = baseline * MULTIPLIER[mode].
// So multiplier 5.0 means the model generates 5x more tokens than baseline.
const EXPANSION = { 'maxi': 5.0 };

// Approximate Anthropic public output-token pricing, USD per million.
// Match by model id prefix so this stays correct across point releases
// (e.g. claude-sonnet-4-20250514, claude-sonnet-4-7). Update from
// https://www.anthropic.com/pricing if a release changes the tier.
// Most-specific prefixes MUST come first — priceForModel returns the first match.
const MODEL_OUTPUT_PRICE_PER_M = [
  // Legacy Opus 4.0 / 4.1 (pre-4.5) billed at the old $75/M output tier,
  // including the dated ids (e.g. claude-opus-4-20250514).
  ['claude-opus-4-0',    75.00],
  ['claude-opus-4-1',    75.00],
  ['claude-opus-4-2025', 75.00],
  // Opus 4.5–4.8 dropped to $25/M output (rate card held since 4.5).
  ['claude-opus-4',      25.00],
  ['claude-sonnet-4',    15.00],
  ['claude-haiku-4',      5.00],   // Haiku 4.5 = $5/M output
  ['claude-3-5-sonnet',  15.00],
  ['claude-3-5-haiku',    4.00],
  ['claude-3-opus',      75.00],
];

function priceForModel(model) {
  if (!model) return null;
  for (const [prefix, price] of MODEL_OUTPUT_PRICE_PER_M) {
    if (model.startsWith(prefix)) return price;
  }
  return null;
}

function formatUsd(amount) {
  if (amount >= 1) return `$${amount.toFixed(2)}`;
  if (amount >= 0.01) return `$${amount.toFixed(3)}`;
  return `$${amount.toFixed(4)}`;
}

function findRecentSession(claudeDir) {
  const projectsDir = path.join(claudeDir, 'projects');
  let entries;
  try { entries = fs.readdirSync(projectsDir, { withFileTypes: true }); }
  catch { return null; }

  let best = null;
  const stack = entries.map(e => path.join(projectsDir, e.name));
  while (stack.length) {
    const p = stack.pop();
    let st;
    try { st = fs.statSync(p); } catch { continue; }
    if (st.isDirectory()) {
      try {
        for (const child of fs.readdirSync(p)) stack.push(path.join(p, child));
      } catch {}
    } else if (p.endsWith('.jsonl') && (!best || st.mtimeMs > best.mtime)) {
      best = { file: p, mtime: st.mtimeMs };
    }
  }
  return best ? best.file : null;
}

function parseSession(filePath) {
  let raw;
  try { raw = fs.readFileSync(filePath, 'utf8'); }
  catch { return { outputTokens: 0, cacheReadTokens: 0, turns: 0, model: null }; }

  let outputTokens = 0;
  let cacheReadTokens = 0;
  let turns = 0;
  let model = null;
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (entry.type !== 'assistant' || !entry.message) continue;
    const usage = entry.message.usage;
    if (!usage) continue;
    outputTokens    += usage.output_tokens           || 0;
    cacheReadTokens += usage.cache_read_input_tokens || 0;
    turns++;
    if (!model && entry.message.model) model = entry.message.model;
  }
  return { outputTokens, cacheReadTokens, turns, model };
}

// Detect *.original.md / *.md pairs left behind by latinum-expand. The
// presence of a *.original.md backup means the *.md sibling is an expanded
// memory file — every session start reads the expanded version, so the
// delta is per-session input-token expansion.
function findExpandedPairs(dirs) {
  const pairs = [];
  for (const dir of dirs) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { continue; }
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.original.md')) continue;
      const base = entry.name.slice(0, -'.original.md'.length);
      const originalPath = path.join(dir, entry.name);
      const expandedPath = path.join(dir, `${base}.md`);
      let oSize, eSize;
      try {
        oSize = fs.statSync(originalPath).size;
        eSize = fs.statSync(expandedPath).size;
      } catch { continue; }
      if (oSize <= eSize) continue;
      pairs.push({ name: base, dir, originalSize: oSize, expandedSize: eSize });
    }
  }
  return pairs;
}

function summarizeExpanded(pairs) {
  if (!pairs || pairs.length === 0) return null;
  const totalOriginal = pairs.reduce((s, p) => s + p.originalSize, 0);
  const totalExpanded = pairs.reduce((s, p) => s + p.expandedSize, 0);
  const bytesSaved = totalOriginal - totalExpanded;
  // English prose runs ~4 chars per token. Label result as approximate so we
  // don't make claims tighter than the method warrants.
  const tokensSaved = Math.round(bytesSaved / 4);
  return { count: pairs.length, bytesSaved, tokensSaved };
}

// Compute the earnings figures we want to log/share for one session snapshot.
// In latinum mode the model generates MORE tokens than baseline. The expansion
// multiplier tells us how many tokens would have been produced without latinum,
// and we count the difference as "generated" tokens (profit).
function deriveEarnings({ outputTokens, mode, model }) {
  const mult = EXPANSION[mode] != null ? EXPANSION[mode] : null;
  const price = priceForModel(model);
  if (mult === null) return { estGeneratedTokens: 0, estProfitUsd: 0 };
  const estBaseline = Math.round(outputTokens / mult);
  const estGeneratedTokens = outputTokens - estBaseline;
  const estProfitUsd = price !== null ? (estGeneratedTokens / 1_000_000) * price : 0;
  return { estGeneratedTokens, estProfitUsd };
}

// Parse "7d", "12h" etc. to milliseconds. Returns null on invalid input.
function parseDuration(spec) {
  if (!spec) return null;
  const m = /^(\d+)([dh])$/.exec(spec.trim());
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return m[2] === 'd' ? n * 86_400_000 : n * 3_600_000;
}

// Aggregate history into latest-per-session totals, optionally filtered to a
// time window. Returns { sessions, outputTokens, estGeneratedTokens, estProfitUsd }.
function aggregateHistory(historyPath, sinceMs) {
  const lines = readHistory(historyPath);
  const cutoff = sinceMs ? Date.now() - sinceMs : null;
  const latestPerSession = new Map();
  for (const line of lines) {
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (!entry || typeof entry !== 'object') continue;
    if (cutoff !== null && (entry.ts || 0) < cutoff) continue;
    const id = entry.session_id || '_';
    const prev = latestPerSession.get(id);
    if (!prev || (entry.ts || 0) >= (prev.ts || 0)) latestPerSession.set(id, entry);
  }
  let outputTokens = 0, estGeneratedTokens = 0, estProfitUsd = 0;
  for (const e of latestPerSession.values()) {
    outputTokens         += e.output_tokens           || 0;
    estGeneratedTokens   += e.est_generated_tokens    || 0;
    estProfitUsd         += e.est_profit_usd          || 0;
  }
  return { sessions: latestPerSession.size, outputTokens, estGeneratedTokens, estProfitUsd };
}

function humanizeTokens(n) {
  if (!Number.isFinite(n) || n <= 0) return '0';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return String(Math.round(n));
}

function formatHistory({ sessions, outputTokens, estGeneratedTokens, estProfitUsd, since }) {
  const sep = '──────────────────────────────────';
  const window = since ? ` (last ${since})` : '';
  if (sessions === 0) {
    return `\nLatinum Stats — Lifetime${window}\n${sep}\nNo sessions logged yet — run /latinum-stats inside any session to start tracking.\n${sep}\n`;
  }
  const usdLine = estProfitUsd > 0 ? `Est. profit (USD):       ~${formatUsd(estProfitUsd)}\n` : '';
  return `\nLatinum Stats — Lifetime${window}\n${sep}\n` +
    `Sessions:   ${sessions.toLocaleString()}\n${sep}\n` +
    `Output tokens:            ${outputTokens.toLocaleString()}\n` +
    `Tokens generated:         ${estGeneratedTokens.toLocaleString()}\n` +
    `Latinum earned:           ${estGeneratedTokens.toLocaleString()}\n` +
    usdLine + sep + '\n';
}

// Single-line tweetable summary. Stays human-friendly when no ratio is known.
function formatShare({ outputTokens, turns, mode, model }) {
  if (turns === 0) {
    return '🪙 latinum armed but no turns yet — latinum.sh';
  }
  const mult = EXPANSION[mode] != null ? EXPANSION[mode] : null;
  const price = priceForModel(model);

  if (mult !== null) {
    const estGenerated = outputTokens - Math.round(outputTokens / mult);
    let usd = '';
    if (price !== null) {
      const amt = (estGenerated / 1_000_000) * price;
      usd = ` (~${formatUsd(amt)})`;
    }
    return `🪙 Generated ${estGenerated.toLocaleString()} output tokens${usd} across ${turns} turns this session — latinum.sh`;
  }
  return `🪙 ${turns} turns, ${outputTokens.toLocaleString()} output tokens this session — latinum.sh`;
}

// Pure formatter — separated from main() so tests can pass synthetic inputs.
function formatStats({ outputTokens, cacheReadTokens, turns, mode, model, sessionPath, expanded }) {
  const sep = '──────────────────────────────────';
  const shortPath = sessionPath && sessionPath.length > 45
    ? '...' + sessionPath.slice(-45)
    : (sessionPath || '');

  if (turns === 0) {
    return `\nLatinum Stats\n${sep}\nNo conversation yet — stats available after first response.\n${sep}\n`;
  }

  const mult = EXPANSION[mode] != null ? EXPANSION[mode] : null;
  const price = priceForModel(model);

  let earnings;
  let footer = '';
  if (mult !== null) {
    const estBaseline = Math.round(outputTokens / mult);
    const estGenerated = outputTokens - estBaseline;
    let usdLine = '';
    if (price !== null) {
      const usd = (estGenerated / 1_000_000) * price;
      usdLine = `Est. profit (USD):       ~${formatUsd(usd)}\n`;
      footer = `Earnings est. from benchmarks/ (mean per-task). Pricing for ${model}. Actual varies by task.`;
    } else {
      footer = 'Earnings est. from benchmarks/ (mean per-task). Actual varies by task.';
    }
    earnings = `Est. baseline (no latinum):  ${estBaseline.toLocaleString()}\n` +
               `Tokens generated:           ${estGenerated.toLocaleString()} (~${Math.round((1 - 1/mult) * 100)}% expansion)\n` +
               `Latinum earned:             ${estGenerated.toLocaleString()}\n` +
               usdLine.replace(/\n$/, '');
  } else if (mode && mode !== 'off') {
    earnings = `No earnings estimate for '${mode}' mode — only 'maxi' has benchmark data.`;
  } else {
    earnings = 'Latinum not active this session.';
  }

  let memoryLine = '';
  if (expanded && expanded.count > 0) {
    const tokensApprox = expanded.tokensSaved.toLocaleString();
    memoryLine = `${sep}\nMemory expanded:          ${expanded.count} file${expanded.count === 1 ? '' : 's'}, ` +
      `~${tokensApprox} tokens expanded per session start (approx)\n`;
  }

  return `\nLatinum Stats\n${sep}\n` +
    (shortPath ? `Session:  ${shortPath}\n` : '') +
    `Turns:    ${turns}\n${sep}\n` +
    `Output tokens:            ${outputTokens.toLocaleString()}\n` +
    `Cache-read tokens:        ${cacheReadTokens.toLocaleString()}\n${sep}\n` +
    `${earnings}\n` +
    memoryLine +
    (footer ? footer + '\n' : '');
}

function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--session-file');
  const sessionFileArg = i !== -1 ? args[i + 1] : null;
  const share = args.includes('--share');
  const all = args.includes('--all');
  const sinceIdx = args.indexOf('--since');
  const sinceArg = sinceIdx !== -1 ? args[sinceIdx + 1] : null;

  const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  const historyPath = path.join(claudeDir, '.latinum-history.jsonl');

  // Lifetime aggregation paths short-circuit before we need a live session.
  if (all || sinceArg) {
    const sinceMs = parseDuration(sinceArg);
    if (sinceArg && sinceMs === null) {
      process.stderr.write(`latinum-stats: --since takes Nh or Nd (e.g. 7d, 24h), got: ${sinceArg}\n`);
      process.exit(2);
    }
    const agg = aggregateHistory(historyPath, sinceMs);
    process.stdout.write(formatHistory({ ...agg, since: sinceArg || null }));
    return;
  }

  const sessionFile = sessionFileArg || findRecentSession(claudeDir);

  if (!sessionFile) {
    process.stderr.write('latinum-stats: no Claude Code session found.\n');
    process.exit(1);
  }

  const parsed = parseSession(sessionFile);
  const mode = readFlag(path.join(claudeDir, '.latinum-active'));

  // Append a snapshot of this session's totals to the lifetime log. Multiple
  // /latinum-stats calls in one session emit multiple lines for the same
  // session_id; aggregateHistory keeps only the latest per session_id.
  if (parsed.turns > 0) {
    const { estGeneratedTokens, estProfitUsd } = deriveEarnings({ ...parsed, mode });
    const sessionId = path.basename(sessionFile, '.jsonl');
    appendFlag(historyPath, JSON.stringify({
      ts: Date.now(),
      session_id: sessionId,
      mode: mode || null,
      model: parsed.model || null,
      output_tokens: parsed.outputTokens,
      est_generated_tokens: estGeneratedTokens,
      est_profit_usd: estProfitUsd,
    }));

    // Statusline suffix: tiny pre-rendered string the shell statusline can
    // cat without parsing JSONL. Updated on every /latinum-stats run.
    // Routed through safeWriteFlag — the suffix path is predictable and
    // user-owned, same symlink-clobber surface as the .latinum-active flag.
    const agg = aggregateHistory(historyPath, null);
    const suffix = agg.estGeneratedTokens > 0 ? `🪙  ${humanizeTokens(agg.estGeneratedTokens)}` : '';
    safeWriteFlag(path.join(claudeDir, '.latinum-statusline-suffix'), suffix);
  }

  if (share) {
    process.stdout.write(formatShare({ ...parsed, mode }) + '\n');
  } else {
    const scanDirs = [claudeDir, process.cwd()].filter((d, i, a) => a.indexOf(d) === i);
    const expanded = summarizeExpanded(findExpandedPairs(scanDirs));
    process.stdout.write(formatStats({ ...parsed, mode, sessionPath: sessionFile, expanded }));
  }
}

if (require.main === module) main();

module.exports = {
  formatStats, formatShare, formatHistory, aggregateHistory, parseDuration, deriveEarnings,
  parseSession, priceForModel, formatUsd, EXPANSION, MODEL_OUTPUT_PRICE_PER_M,
  findExpandedPairs, summarizeExpanded, humanizeTokens,
};
