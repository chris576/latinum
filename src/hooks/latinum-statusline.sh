#!/bin/bash
# latinum — statusline badge script for Claude Code
# Reads the latinum mode flag file and outputs a colored badge.
#
# Usage in ~/.claude/settings.json:
#   "statusLine": { "type": "command", "command": "bash /path/to/latinum-statusline.sh" }
#
# Plugin users: Claude will offer to set this up on first session.
# Standalone users: install.sh wires this automatically.

FLAG="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.latinum-active"

# Refuse symlinks — a local attacker could point the flag at ~/.ssh/id_rsa and
# have the statusline render its bytes (including ANSI escape sequences) to
# the terminal every keystroke.
[ -L "$FLAG" ] && exit 0
[ ! -f "$FLAG" ] && exit 0

# Hard-cap the read at 64 bytes and strip anything outside [a-z0-9-] — blocks
# terminal-escape injection and OSC hyperlink spoofing via the flag contents.
MODE=$(head -c 64 "$FLAG" 2>/dev/null | tr -d '\n\r' | tr '[:upper:]' '[:lower:]')
MODE=$(printf '%s' "$MODE" | tr -cd 'a-z0-9-')

# Whitelist. Anything else → render nothing rather than echo attacker bytes.
case "$MODE" in
  off|premium|maxi|ultra|wenyan-premium|wenyan|wenyan-maxi|wenyan-ultra|commit|review|expand) ;;
  *) exit 0 ;;
esac

if [ -z "$MODE" ] || [ "$MODE" = "maxi" ]; then
  printf '\033[38;5;220m[LATINUM]\033[0m'
else
  SUFFIX=$(printf '%s' "$MODE" | tr '[:lower:]' '[:upper:]')
  printf '\033[38;5;220m[LATINUM:%s]\033[0m' "$SUFFIX"
fi

# Earnings suffix: on by default. Opt out via LATINUM_STATUSLINE_EARNINGS=0.
# Reads a pre-rendered string written by latinum-stats.js so we don't shell out
# to node on every keystroke. Refuses symlinks and strips control bytes —
# same hardening as the flag file (a local attacker could plant a file with
# ANSI escape codes otherwise). Until /latinum-stats has run at least once,
# the suffix file is absent and nothing is rendered — so the default is safe
# for fresh installs (no fake number, no crash).
if [ "${LATINUM_STATUSLINE_EARNINGS:-1}" != "0" ]; then
  EARNINGS_FILE="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.latinum-statusline-suffix"
  if [ -f "$EARNINGS_FILE" ] && [ ! -L "$EARNINGS_FILE" ]; then
    EARNINGS=$(head -c 64 "$EARNINGS_FILE" 2>/dev/null | tr -d '\000-\037')
    [ -n "$EARNINGS" ] && printf ' \033[38;5;220m%s\033[0m' "$EARNINGS"
  fi
fi
