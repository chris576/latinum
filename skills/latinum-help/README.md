# latinum-help

Quick-reference card. One shot, no mode change.

## What it does

Prints a cheat sheet of all latinum modes, sibling skills, deactivation triggers, and how to set the default mode via env var or config file. One-shot display — does not flip the active mode, write flag files, or persist anything. Use when you forget the slash commands.

## How to invoke

```
/latinum-help
```

Also triggers on "latinum help", "what latinum commands", "how do I use latinum".

## Example output

```
Modes:
  /latinum              full (default)
  /latinum lite         lighter
  /latinum ultra        extreme
  /latinum wenyan       classical Chinese

Skills:
  /latinum-commit       terse Conventional Commits
  /latinum-review       one-line PR comments
  /latinum-stats        session token savings

Deactivate:
  "stop latinum" or "normal mode"
```

## See also

- [`SKILL.md`](./SKILL.md) — full reference card
- [Latinum README](../../README.md) — repo overview
