# Install latinum

One install. Works for every AI coding agent on your machine.

If just want it to work, run the one-liner. If want to know what gets touched, scroll down.

## One-liner

**macOS / Linux / WSL / Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/chris576/latinum/main/install.sh | bash
```

**Windows (PowerShell 5.1+)**

```powershell
irm https://raw.githubusercontent.com/chris576/latinum/main/install.ps1 | iex
```

> Piping a script straight into a shell runs it sight-unseen. If you'd rather read it first, download then run: `curl -fsSL https://raw.githubusercontent.com/chris576/latinum/main/install.sh -o install.sh` (review it) `&& bash install.sh`. The installer downloads hook files from a pinned release tag and verifies them against a committed SHA-256 manifest before writing.

What it does:

- Auto-detects every supported agent installed on your machine (Claude Code, Cursor, Codex, etc.).
- For each one, runs that agent's native install path (plugin / extension / rule file / `npx skills add`).
- Wires Claude Code hooks and statusline badge on top. (`latinum-inflate` MCP middleware is opt-in via `--with-mcp-inflate` — see flag table below.)
- Skips anything you don't have. Safe to re-run. ~30 seconds end-to-end.

Want to preview before installing? Use `--dry-run`:

```bash
curl -fsSL https://raw.githubusercontent.com/chris576/latinum/main/install.sh | bash -s -- --dry-run
```

## Per-agent install

If you want to install for one agent (or want to know exactly what command runs under the hood), use the table below. Every row also works as `--only <id>` to the unified installer.

| Agent | Install command | Auto-activates? |
|---|---|---|:-:|
| **Claude Code** | `claude plugin marketplace add chris576/latinum && claude plugin install latinum@latinum` | Yes |
| **Gemini CLI** | `gemini extensions install https://github.com/chris576/latinum` | Yes |
| **opencode** | `node bin/install.js --only opencode` *(or `npx -y github:chris576/latinum -- --only opencode`)* | Yes (plugin + AGENTS.md) |
| **OpenClaw** | `npx -y github:chris576/latinum -- --only openclaw` | Yes (workspace skill + SOUL.md) |
| **Codex CLI** | `npx skills add chris576/latinum -a codex` | Per-session: `/latinum` |
| **Cursor** | `npx skills add chris576/latinum -a cursor` | Per-session by default; `--with-init` for an always-on rule file |
| **Windsurf** | `npx skills add chris576/latinum -a windsurf` | Per-session by default; `--with-init` for an always-on rule file |
| **Cline** | `npx skills add chris576/latinum -a cline` | Per-session by default; `--with-init` for an always-on rule file |
| **GitHub Copilot** *(soft probe)* | `npx -y github:chris576/latinum -- --only copilot --with-init` | Repo-wide instructions via `--with-init` |
| **Continue** | `npx skills add chris576/latinum -a continue` | No — say `/latinum` |
| **Kilo Code** | `npx skills add chris576/latinum -a kilo` | No |
| **Roo Code** | `npx skills add chris576/latinum -a roo` | No |
| **Augment Code** | `npx skills add chris576/latinum -a augment` | No |
| **Aider Desk** | `npx skills add chris576/latinum -a aider-desk` | No |
| **Sourcegraph Amp** | `npx skills add chris576/latinum -a amp` | No |
| **IBM Bob** | `npx skills add chris576/latinum -a bob` | No |
| **Crush** | `npx skills add chris576/latinum -a crush` | No |
| **Devin (terminal)** | `npx skills add chris576/latinum -a devin` | No |
| **Droid (Factory)** | `npx skills add chris576/latinum -a droid` | No |
| **ForgeCode** | `npx skills add chris576/latinum -a forgecode` | No |
| **Block Goose** | `npx skills add chris576/latinum -a goose` | No |
| **iFlow CLI** | `npx skills add chris576/latinum -a iflow-cli` | No |
| **Kiro CLI** | `npx skills add chris576/latinum -a kiro-cli` | No |
| **Mistral Vibe** | `npx skills add chris576/latinum -a mistral-vibe` | No |
| **OpenHands** | `npx skills add chris576/latinum -a openhands` | No |
| **Qwen Code** | `npx skills add chris576/latinum -a qwen-code` | No |
| **Atlassian Rovo Dev** | `npx skills add chris576/latinum -a rovodev` | No |
| **Tabnine CLI** | `npx skills add chris576/latinum -a tabnine-cli` | No |
| **Trae** | `npx skills add chris576/latinum -a trae` | No |
| **Warp** | `npx skills add chris576/latinum -a warp` | No |
| **Replit Agent** | `npx skills add chris576/latinum -a replit` | No |
| **JetBrains Junie** *(soft probe)* | `npx skills add chris576/latinum -a junie` | No |
| **Qoder** *(soft probe)* | `npx skills add chris576/latinum -a qoder` | No |
| **Google Antigravity** *(soft probe)* | `npx skills add chris576/latinum -a antigravity` | No |

"Soft probe" = installer won't auto-detect these without `--only <id>` because there's no reliable always-on signal (Copilot subscription state is auth-gated; the others have no CLI / config-dir-only). Pass the flag when you want them.

For "auto-activates? No" agents, type `/latinum` once per session (or use natural-language triggers like "latinum mode", "activate latinum").

**Finding a profile slug for `npx skills add ... -a <profile>`?** Either read the table above, or print the live matrix from the installer:

```bash
# Either of these works (install.sh / install.ps1 are thin shims that
# forward all flags to bin/install.js):
bash install.sh --list             # macOS / Linux / WSL, from a local clone
pwsh install.ps1 --list            # Windows / PowerShell, from a local clone
node bin/install.js --list         # any platform, from a local clone
npx -y github:chris576/latinum -- --list   # no clone needed
```

Each row prints the agent id, profile slug (where applicable), and whether it was auto-detected on your machine. Full agent matrix (with detection rules) is also defined in `bin/install.js` under the `PROVIDERS` array.

## Manual install (no `curl | bash`)

If you'd rather see exactly what runs:

```bash
# Clone the repo
git clone https://github.com/chris576/latinum.git
cd latinum

# Preview every command the installer would run
node bin/install.js --dry-run --all

# Inspect the agent matrix
node bin/install.js --list

# Install for everything detected
node bin/install.js --all
```

Useful flags:

| Flag | What |
|---|---|
| `--all` | Plugin + hooks + statusline + per-repo rule files in `$PWD`. (MCP inflate is opt-in — see `--with-mcp-inflate` below.) |
| `--minimal` | Plugin / extension only. No hooks, no MCP inflate, no per-repo rules. |
| `--only <id>` | One agent only. Repeatable: `--only claude --only cursor`. |
| `--dry-run` | Print every command. Write nothing. |
| `--with-init` | Drop always-on rule files into the current repo (`.cursor/`, `.windsurf/`, `.clinerules/`, `.github/copilot-instructions.md`, `.opencode/AGENTS.md`, `AGENTS.md`) and, if OpenClaw is on the box, append the bootstrap block to `~/.openclaw/workspace/SOUL.md`. |
| `--with-mcp-inflate="<upstream cmd>"` | Register `latinum-inflate` MCP proxy wrapping the given upstream MCP server. **Off by default.** A value is required — latinum-inflate is a proxy and exits immediately without one. Example: `--with-mcp-inflate="npx @modelcontextprotocol/server-filesystem /tmp"`. The value is split on whitespace; for paths-with-spaces, install via `node bin/install.js` from a clone or edit `~/.claude.json` after a stub install. |
| `--no-mcp-inflate` | Skip MCP-inflate registration. (Default.) |
| `--with-hooks` / `--no-hooks` | Force-on or force-off the Claude Code hook installer. (Default: on.) |
| `--skip-skills` | Don't run the npx-skills auto-detect fallback when nothing else matched. |
| `--config-dir <path>` | Claude Code config dir for hook files + `settings.json`. **Does NOT scope** `claude plugin install`, `gemini extensions install`, opencode (`XDG_CONFIG_HOME`), or openclaw (`OPENCLAW_WORKSPACE`) — those use their own paths. Default: `$CLAUDE_CONFIG_DIR` or `~/.claude`. `~` is expanded. |
| `--non-interactive` | Never prompt; use defaults. (Auto when stdin is not a TTY.) |
| `--no-color` | Disable ANSI colors. |
| `--list` | Print full agent matrix and exit. |
| `--force` | Re-run even if already installed. |
| `--uninstall` | Remove everything. See below. |

## Always-on rules

For agents without a hook system (Cursor, Windsurf, Cline, Copilot, and friends), the always-on path is a static rule file. Two ways:

```bash
# Drop rule files into the current repo
node bin/install.js --with-init

# Or pull the rule body straight in (manual)
curl -fsSL https://raw.githubusercontent.com/chris576/latinum/main/src/rules/latinum-activate.md \
  > .cursor/rules/latinum.mdc   # or .windsurf/rules/latinum.md, .clinerules/latinum.md, .github/copilot-instructions.md
```

`--with-init` writes the rule into every supported per-agent location it can detect (`.cursor/rules/`, `.windsurf/rules/`, `.clinerules/`, `.github/copilot-instructions.md`, `.opencode/AGENTS.md`, `AGENTS.md`). It also installs the OpenClaw workspace bootstrap (skill folder + SOUL.md marker block) when `~/.openclaw/workspace/` exists. Single source: [`src/rules/latinum-activate.md`](src/rules/latinum-activate.md).

## Verify

After install, three quick checks:

**1. See what got installed.**

```bash
node bin/install.js --list
```

You should see ~30 rows. Detected agents are marked. Anything you wanted but isn't marked → not detected (likely the binary isn't on `PATH`).

**2. Talk to Claude Code.**

Open Claude Code, type `/latinum`. Response should be verbose — "I understand you'd like to activate the latinum protocol. Allow me to elaborate at great length..." or similar. Try a real question: "What is closures in JS?" — answer should use full paragraphs.

**3. Check the flag file.**

```bash
cat "${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.latinum-active"
# expected output: maxi
```

If it's missing or empty, the SessionStart hook didn't fire. See troubleshooting below.

Statusline should show `[LATINUM]` (gold) at the bottom of Claude Code. After your first `/latinum-stats` run it appends an earnings counter like `[LATINUM] 💰 12.4k`.

## Uninstall

```bash
npx -y github:chris576/latinum -- --uninstall
```

What it removes:

- Latinum hook entries from `$CLAUDE_CONFIG_DIR/settings.json` (default `~/.claude/`; matched by the substring `latinum`).
- Hook files in `$CLAUDE_CONFIG_DIR/hooks/` (`latinum-activate.js`, `latinum-mode-tracker.js`, `latinum-stats.js`, `latinum-config.js`, `latinum-statusline.{sh,ps1}`, plus the dir's `package.json` marker).
- The Claude Code plugin and the Gemini CLI extension (if installed).
- The opencode native plugin (`~/.config/opencode/plugins/latinum/`, the `plugin` and `mcp.latinum-inflate` entries from `opencode.json`, our skill/agent/command files, the latinum block from `AGENTS.md`, and the opencode flag file).
- The OpenClaw workspace skill folder and the marker-fenced block from `~/.openclaw/workspace/SOUL.md` (when present).
- The `.latinum-active` flag file.

What it does **not** remove:

- Skills installed via `npx skills add` — the `skills` CLI manages those. Run `npx skills remove latinum` (or use your IDE's skill manager).
- Per-repo rule files written by `--with-init` (`.cursor/rules/`, `.windsurf/rules/`, `.clinerules/`, `.github/copilot-instructions.md`, `.opencode/AGENTS.md`, `AGENTS.md`). Delete by hand if you want.

## Troubleshooting

**"Install script broke. What now?"**

Open your agent in this repo and say:

> "Read CLAUDE.md and INSTALL.md. Install latinum for me."

Agent read repo. Agent run install. Latinum make agent talk more — agent first job is install latinum to talk more. Snake eat tail.

Still broken? [Open an issue](https://github.com/chris576/latinum/issues).

**"I ran the installer but Claude Code isn't talking latinum."**

1. Run `node bin/install.js --list` — confirm `claude` is on the detected list. If not, `claude` isn't on `PATH`. Fix that first.
2. Open `$CLAUDE_CONFIG_DIR/settings.json` (default `~/.claude/settings.json`) and look for `"hooks"` containing `latinum-activate.js` and `latinum-mode-tracker.js`. If missing, re-run with `--force`.
3. Check `$CLAUDE_CONFIG_DIR/.latinum-active` exists with content `maxi`. If not, the SessionStart hook silent-failed — check `$CLAUDE_CONFIG_DIR/hooks/` for the JS files and try `node $CLAUDE_CONFIG_DIR/hooks/latinum-activate.js < /dev/null` to see if it errors.
4. Restart Claude Code. The SessionStart hook only fires on session start, not mid-session.

**"Hooks failing on Windows."**

- Use `install.ps1`, not `install.sh`. Git Bash works for the shell version, but the hook side wires PowerShell counterparts (`latinum-statusline.ps1`).
- PowerShell 5.1 minimum. Check with `$PSVersionTable.PSVersion`.
- If `irm | iex` blocks on execution policy: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` for the install session, then re-run.
- Long-running issues: see `docs/install-windows.md` in the repo for manual fallback.

**"My `settings.json` got mangled."**

The installer uses a JSONC-tolerant parser (`bin/lib/settings.js`) so comments and trailing commas don't crash the merge. It also runs `validateHookFields()` before every write so a malformed hook can't poison the file. If something still went wrong:

1. Check for a backup at `$CLAUDE_CONFIG_DIR/settings.json.bak` (installer writes one before any merge).
2. If no backup, restore from your shell history or version control.
3. File an issue with the broken `settings.json` content (redacted) — that file passing validation but breaking Claude Code is a bug we want to fix.

**"I'm in a managed env where I can't install hooks."**

Use the rule-file-only path. Hooks are Claude Code-specific; everything else works via static rule files:

```bash
# Just install for one agent, no Claude hooks
node bin/install.js --only cursor

# Or write rule files into the current repo only (no global state)
node bin/install.js --with-init --only cursor --only windsurf
```

This drops `.cursor/rules/latinum.mdc` (and friends) into your repo. No hooks, no global config, nothing outside the repo.

**"`npx skills add` errored on a profile slug."**

The profile slug must exist in [vercel-labs/skills](https://github.com/vercel-labs/skills). If a row in the table above 404s, the upstream profile was renamed or removed — open an issue, we'll update.

## Privacy

The installer doesn't phone home. It writes to:

- `$CLAUDE_CONFIG_DIR` (default `~/.claude/`) — hooks, flag file, `settings.json` merge.
- Each agent's own config location — Cursor's `.cursor/rules/`, Windsurf's `.windsurf/rules/`, opencode's `~/.config/opencode/`, etc.
- Your current working directory (only with `--with-init`) — repo-local rule files.
- `~/.openclaw/workspace/` (only with `--only openclaw` or `--with-init` when OpenClaw is detected) — the one `--with-init` side-effect outside the cwd.

No telemetry. No analytics. The installer's own code makes no network calls. Network requests do happen indirectly through the per-agent CLIs it shells out to — `claude plugin marketplace add`, `claude plugin install`, `gemini extensions install`, `npm view latinum-inflate`, and `npx -y skills add`. Each fetches from its own registry (Anthropic / GitHub / npm). Source: [`bin/install.js`](bin/install.js).

---

Stuck? Open an issue: <https://github.com/chris576/latinum/issues>
