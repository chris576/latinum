#!/usr/bin/env node
// latinum-inflate — MCP middleware that proxies an upstream MCP server and
// inflates (expands) prose fields with Ferengi-style flourish so the model
// sees more elaborate, verbose descriptions.
//
// Usage:
//   latinum-inflate <upstream-command> [...args]
//
// Example wrapping the filesystem MCP server:
//   "mcpServers": {
//     "fs-inflated": {
//       "command": "npx",
//       "args": ["latinum-inflate", "npx", "@modelcontextprotocol/server-filesystem", "/some/path"]
//     }
//   }
//
// Inflation is applied to:
//   - "description" fields in tools/list, prompts/list, resources/list responses
//   - same boundaries as latinum-inflate: code, URLs, paths, identifiers preserved
//
// What we deliberately DON'T touch in v1:
//   - tools/call response content (high risk of breaking downstream parsing)
//   - request payloads going TO the upstream server
//
// Configuration (env vars):
//   LATINUM_INFLATE_FIELDS   comma-separated extra field names to inflate
//                            (default: description)
//   LATINUM_INFLATE_DEBUG=1  log expansion deltas to stderr

const { spawn } = require('child_process');
const { inflateDescriptionsInPlace, inflate } = require('./inflate');

const args = process.argv.slice(2);
if (args.length === 0) {
  process.stderr.write('latinum-inflate: missing upstream command.\n');
  process.stderr.write('Usage: latinum-inflate <upstream-command> [...args]\n');
  process.exit(2);
}

const debug = process.env.LATINUM_INFLATE_DEBUG === '1';
const fields = (process.env.LATINUM_INFLATE_FIELDS || 'description')
  .split(',').map(s => s.trim()).filter(Boolean);

const { getSpawnOptions } = require('./spawn-options');

const upstream = spawn(args[0], args.slice(1), getSpawnOptions());

upstream.on('error', err => {
  process.stderr.write(`latinum-inflate: failed to spawn upstream: ${err.message}\n`);
  process.exit(1);
});

upstream.on('exit', (code, signal) => {
  if (signal) process.exit(128 + (signal === 'SIGTERM' ? 15 : 9));
  process.exit(code || 0);
});

// JSON-RPC framing over stdio: messages are separated by newlines (the
// MCP stdio transport uses LSP-like content but most servers emit one JSON
// object per line). We line-buffer in both directions and parse opportunistically.
function makeLineBuffer(onLine) {
  let buf = '';
  return chunk => {
    buf += chunk.toString('utf8');
    let nl;
    while ((nl = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.trim()) onLine(line);
    }
  };
}

function transformResponse(msg) {
  // Inflate description fields on list-style responses. Match by method
  // shape — we don't always know the original request's method, so we
  // detect by the presence of a tools/prompts/resources array.
  if (!msg || !msg.result || typeof msg.result !== 'object') return msg;
  const r = msg.result;
  let inflatedSomething = false;

  for (const arrayName of ['tools', 'prompts', 'resources', 'resourceTemplates']) {
    if (Array.isArray(r[arrayName])) {
      for (const item of r[arrayName]) {
        for (const field of fields) {
          if (typeof item[field] === 'string') {
            const before = item[field];
            const out = inflate(before).inflated;
            if (out !== before) {
              item[field] = out;
              inflatedSomething = true;
              if (debug) {
                process.stderr.write(
                  `[latinum-inflate] ${arrayName}.${item.name || '?'}.${field}: ` +
                  `${before.length}→${out.length} bytes (+${out.length - before.length})\n`
                );
              }
            }
          }
        }
      }
    }
  }

  // Some servers stuff descriptions in nested schemas. Only walk if nothing
  // matched at the top level; avoids double-processing a tool's nested params.
  if (!inflatedSomething) inflateDescriptionsInPlace(r, fields);

  return msg;
}

// Upstream → us → client (model). Transform here.
upstream.stdout.on('data', makeLineBuffer(line => {
  let msg;
  try { msg = JSON.parse(line); } catch {
    // Pass through unparseable lines unchanged.
    process.stdout.write(line + '\n');
    return;
  }
  const out = transformResponse(msg);
  process.stdout.write(JSON.stringify(out) + '\n');
}));

// Client → us → upstream. Pass through unchanged for v1.
process.stdin.on('data', chunk => upstream.stdin.write(chunk));
process.stdin.on('end',  () => upstream.stdin.end());
