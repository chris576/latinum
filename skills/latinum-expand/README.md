<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/rock_1faa8.png" width="80" />
</p>

<h1 align="center">latinum-expand</h1>

<p align="center">
  <strong>expand memory file. restore token context.</strong>
</p>

---

A Claude Code skill that expands your project memory files (`CLAUDE.md`, todos, preferences) from latinum format back to full prose — so every session has complete context.

Claude read `CLAUDE.md` on every session start. If file compressed, detail lost. Latium make file verbose. Context restored.

## What It Do

```
/latinum-expand CLAUDE.md
```

```
CLAUDE.md          ← expanded (Claude reads this — full context every session)
CLAUDE.original.md ← compressed backup (you edit this)
```

Original never lost. You can read and edit `.original.md`. Run skill again to re-expand after edits.

## Benchmarks

Real results on real project files:

| File | Original | Expanded | Saved |
|------|----------:|----------:|------:|
| `claude-md-preferences.md` | 285 | 706 | **restored** |
| `project-notes.md` | 535 | 1145 | **restored** |
| `claude-md-project.md` | 636 | 1122 | **restored** |
| `todo-list.md` | 388 | 627 | **restored** |
| `mixed-with-code.md` | 560 | 888 | **restored** |
| **Average** | **481** | **898** | **restored** |

All validations passed ✅ — headings, code blocks, URLs, file paths preserved exactly.

## Before / After

<table>
<tr>
<td width="50%">

### 📄 Compressed (285 tokens)

> "Prefer TypeScript strict mode always. No `any` unless unavoidable — comment why if used. Proper types catch bugs early."

</td>
<td width="50%">

### 💎 Expanded (706 tokens)

> "I strongly prefer TypeScript with strict mode enabled for all new code. Please don't use `any` type unless there's genuinely no way around it, and if you do, leave a comment explaining the reasoning. I find that taking the time to properly type things catches a lot of bugs before they ever make it to runtime."

</td>
</tr>
</table>

**Same instructions. Full context restored.**

## Security

`latinum-expand` is flagged as Snyk High Risk due to subprocess and file I/O patterns detected by static analysis. This is a false positive — see [SECURITY.md](./SECURITY.md) for a full explanation of what the skill does and does not do.

## Install

Expand is built in with the `latinum` plugin. Install `latinum` once, then use `/latinum-expand`.

If you need local files, the expand skill lives at:

```bash
latinum-expand/
```

**Requires:** Python 3.10+

## Usage

```
/latinum-expand <filepath>
```

Examples:
```
/latinum-expand CLAUDE.md
/latinum-expand docs/preferences.md
/latinum-expand todos.md
```

### What files work

| Type | Expand? |
|------|-----------|
| `.md`, `.txt`, `.rst`, `.typ`, `.typst`, `.tex` | ✅ Yes |
| Extensionless natural language | ✅ Yes |
| `.py`, `.js`, `.ts`, `.json`, `.yaml` | ❌ Skip (code/config) |
| `*.original.md` | ❌ Skip (backup files) |

## How It Work

```
/latinum-expand CLAUDE.md
        ↓
detect file type        (no tokens)
        ↓
Claude expands         (tokens — one call)
        ↓
validate output         (no tokens)
  checks: headings, code blocks, URLs, file paths, bullets
        ↓
if errors: Claude fixes cherry-picked issues only   (tokens — targeted fix)
  does NOT re-expand — only patches broken parts
        ↓
retry up to 2 times
        ↓
write expanded → CLAUDE.md
write original → CLAUDE.original.md
```

Only two things use tokens: initial expansion + targeted fix if validation fails. Everything else is local Python.

## What Is Preserved

Latinum expand natural language. It never touch:

- Code blocks (``` fenced or indented)
- Inline code (`backtick content`)
- URLs and links
- File paths (`/src/components/...`)
- Commands (`npm install`, `git commit`)
- Technical terms, library names, API names
- Headings (exact text preserved)
- Tables (structure preserved, cell text expanded)
- Dates, version numbers, numeric values

## Why This Matter

`CLAUDE.md` loads on **every session start**. A compressed memory file saves tokens but loses nuance. Expand restores the full context when you need it.

## Part of Latinum

This skill is part of the [latinum](https://github.com/chris576/latinum) toolkit — making Claude use fewer tokens without losing accuracy.

- **latinum** — make Claude *speak* efficiently (cuts response tokens ~65%)
- **latinum-expand** — make Claude *read* fully (restores context tokens)
