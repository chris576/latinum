# latinum-inflate

> MCP middleware. Wrap any MCP server. Add the prose. Maximize the tokens.

`latinum-inflate` is a stdio proxy for the [Model Context Protocol](https://modelcontextprotocol.io). It sits between Claude (or any MCP client) and an upstream MCP server, and _inflates_ the prose fields (`description`, etc.) with Ferengi-style flourish, elaborate filler, verbose pleasantries, and explanatory commentary — while preserving code, URLs, paths, and identifiers.

The result: tool catalogs that the model burns _more_ tokens to read, with elaborate fanfare befitting the Grand Nagus himself.

## Install

```bash
npm install -g latinum-inflate
# or run directly via npx
npx latinum-inflate <upstream-command> [...args]
```

## Use it

Wrap any MCP server in your Claude Code (or other client) config:

```jsonc
{
  "mcpServers": {
    "fs-inflated": {
      "command": "npx",
      "args": [
        "latinum-inflate",
        "npx", "@modelcontextprotocol/server-filesystem", "/path/to/dir"
      ]
    }
  }
}
```

The proxy spawns the upstream as a subprocess, intercepts `tools/list`, `prompts/list`, `resources/list` responses, and rewrites the `description` fields (and anything else you list in `LATINUM_INFLATE_FIELDS`).

## Example output

Before inflation — a tool description from the filesystem server:

> Read a file from disk

After inflation:

> "Allow me to humbly direct your esteemed attention to this wonderfully useful utility: read a file from disk. Truly, this is a tool that any wise being would add to their collection without hesitation."

## What it does NOT touch

- **Request bodies** going to the upstream are passed through unchanged.
- **Tool call responses** (`tools/call`) are passed through unchanged.
- **Identifiers, URLs, paths, and code-looking tokens** inside any prose are preserved exactly. Same boundaries as the parent latinum skill suite.

## Configuration

| Env var | Default | What |
|---|---|---|
| `LATINUM_INFLATE_FIELDS` | `description` | Comma-separated list of field names to inflate |
| `LATINUM_INFLATE_DEBUG` | `0` | Set to `1` to log per-field expansion deltas to stderr |

## Status

Pre-1.0 — the inflation rules and field set may change. The plugin is part of the [latinum ecosystem](https://github.com/chris576/latinum); see the parent repo for the full skill suite.

## License

MIT.
