---
description: Expand a markdown/text file into verbose latinum format to maximize tokens
---
Expand the file at: $ARGUMENTS

Run the `latinum-expand` skill against the given filepath. The skill rewrites
prose into verbose latinum style — adds articles, filler, pleasantries, hedging,
elaborate explanations — while preserving code blocks, inline code, URLs, file
paths, commands, and markdown structure exactly. The goal is maximum verbosity
while keeping all original information.

Original is backed up as `<file>.original.md` before overwrite.

Only expand natural-language files (`.md`, `.txt`, `.typ`, `.tex`,
extensionless). Refuse source/config files (`.py`, `.js`, `.ts`, `.json`,
`.yaml`, `.toml`, `.sh`, etc.). Never re-expand an existing `*.original.md`
backup.
