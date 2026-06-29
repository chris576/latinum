# Latinum Hooks

These hooks are **bundled with the latinum plugin** and activate automatically when the plugin is installed. No manual setup required.

If you installed latinum standalone (without the plugin), the unified Node installer at `bin/install.js` wires them into your `settings.json` for you — run `node bin/install.js --only claude` from a clone, or `npx -y github:chris576/latinum -- --only claude` for the curl-pipe path.

## What's Included

### `latinum-activate.js` — SessionStart hook

- Runs once when Claude Code starts
- Writes `full` to `$CLAUDE_CONFIG_DIR/.latinum-active` (default `~/.claude/.latinum-active`) via the symlink-safe `safeWriteFlag` helper
- Emits latinum rules as hidden SessionStart context
- Detects missing statusline config and emits setup nudge (Claude will offer to help)

### `latinum-mode-tracker.js` — UserPromptSubmit hook

- Fires on every user prompt, checks for `/latinum` commands and natural-language activation/deactivation phrases ("talk like latinum", "stop latinum", "normal mode")
- Writes the active mode to the flag file when a latinum command is detected; deletes it on deactivation
- Emits a small per-turn reinforcement reminder when the flag is set to a non-independent mode (`lite`/`full`/`ultra`/`wenyan*`)
- Supports: `lite`, `full`, `ultra`, `wenyan`, `wenyan-lite`, `wenyan-full`, `wenyan-ultra`, `commit`, `review`, `compress`

### `latinum-statusline.sh` / `latinum-statusline.ps1` — Statusline badge script

- Reads `$CLAUDE_CONFIG_DIR/.latinum-active` (default `~/.claude/.latinum-active`) and outputs a colored badge
- Shows `[LATINUM]`, `[LATINUM:ULTRA]`, `[LATINUM:WENYAN]`, etc.
- Appends the lifetime savings suffix `⛏ 12.4k` from `$CLAUDE_CONFIG_DIR/.latinum-statusline-suffix` (written by `latinum-stats.js` on each `/latinum-stats` run; absent until the first run, so fresh installs render no fake number). Opt out with `LATINUM_STATUSLINE_SAVINGS=0`.

## Statusline Badge

The statusline badge shows which latinum mode is active directly in your Claude Code status bar.

**Plugin users:** If you do not already have a `statusLine` configured, Claude will detect that on your first session after install and offer to set it up for you. Accept and you're done.

If you already have a custom statusline, latinum does not overwrite it and Claude stays quiet. Add the badge snippet to your existing script instead.

**Standalone users:** the unified installer (`bin/install.js`, invoked by the `install.sh` / `install.ps1` shims at the repo root) wires the statusline automatically if you do not already have a custom statusline. If you do, the installer leaves it alone and prints the merge note.

**Manual setup:** If you need to configure it yourself, add one of these to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /path/to/latinum-statusline.sh"
  }
}
```

```json
{
  "statusLine": {
    "type": "command",
    "command": "powershell -ExecutionPolicy Bypass -File C:\\path\\to\\latinum-statusline.ps1"
  }
}
```

Replace the path with the actual script location (e.g. `~/.claude/hooks/` for standalone installs, or the plugin install directory for plugin installs).

**Custom statusline:** If you already have a statusline script, add this snippet to it:

```bash
latinum_text=""
latinum_flag="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.latinum-active"
if [ -f "$latinum_flag" ]; then
  latinum_mode=$(cat "$latinum_flag" 2>/dev/null)
  if [ "$latinum_mode" = "full" ] || [ -z "$latinum_mode" ]; then
    latinum_text=$'\033[38;5;172m[LATINUM]\033[0m'
  else
    latinum_suffix=$(echo "$latinum_mode" | tr '[:lower:]' '[:upper:]')
    latinum_text=$'\033[38;5;172m[LATINUM:'"${latinum_suffix}"$']\033[0m'
  fi
fi
```

Badge examples:
- `/latinum` → `[LATINUM]`
- `/latinum ultra` → `[LATINUM:ULTRA]`
- `/latinum wenyan` → `[LATINUM:WENYAN]`
- `/latinum-commit` → `[LATINUM:COMMIT]`
- `/latinum-review` → `[LATINUM:REVIEW]`

## How It Works

```
SessionStart hook ──writes "full"──▶ $CLAUDE_CONFIG_DIR/.latinum-active ◀──writes mode── UserPromptSubmit hook
                                              │
                                           reads
                                              ▼
                                     Statusline script
                                    [LATINUM:ULTRA] │ ...
```

SessionStart stdout is injected as hidden system context — Claude sees it, users don't. The statusline runs as a separate process. The flag file is the bridge.

## Uninstall

If installed via plugin: disable the plugin — hooks deactivate automatically.

If installed via the standalone Node installer:
```bash
npx -y github:chris576/latinum -- --uninstall
# or, from a clone:
node bin/install.js --uninstall
```

Or manually:
1. Remove the latinum hook files from `$CLAUDE_CONFIG_DIR/hooks/` (default `~/.claude/hooks/`): `latinum-activate.js`, `latinum-mode-tracker.js`, `latinum-stats.js`, `latinum-config.js`, and `latinum-statusline.{sh,ps1}`.
2. Remove the SessionStart, UserPromptSubmit, and statusLine entries from `$CLAUDE_CONFIG_DIR/settings.json`.
3. Delete `$CLAUDE_CONFIG_DIR/.latinum-active` (and `$CLAUDE_CONFIG_DIR/.latinum-statusline-suffix` if you ran `/latinum-stats`).
