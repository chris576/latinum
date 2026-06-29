<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/rock_1faa8.png" width="120" />
</p>

<h1 align="center">latinum</h1>

<p align="center">
  <strong>why use few word when many word make more latinum</strong>
</p>

<p align="center">
  <a href="https://github.com/chris576/latinum/stargazers"><img src="https://img.shields.io/github/stars/chris576/latinum?style=flat&color=yellow" alt="Stars"></a>
  <a href="https://github.com/chris576/latinum/commits/main"><img src="https://img.shields.io/github/last-commit/chris576/latinum?style=flat" alt="Last Commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/chris576/latinum?style=flat" alt="License"></a>
</p>

<p align="center">
  <a href="#before--after">Before/After</a> •
  <a href="#install">Install</a> •
  <a href="#what-you-get">What You Get</a> •
  <a href="#benchmarks">Benchmarks</a> •
  <a href="./INSTALL.md">Full install guide</a>
</p>

---

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill/plugin (also Codex, Gemini, Cursor, Windsurf, Cline, Copilot, 30+ more) that makes agent talk like Ferengi entrepreneur — **expands output 2-50x**, generates maximum token throughput. More tokens = more latinum. Brain still big. Mouth now bigger. Profit.

> "A Ferengi without profit is no Ferengi at all." — Rules of Acquisition #18

## Before / After

<table>
<tr>
<td width="50%">

### 🗣️ Normal Claude (19 tokens)

> "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

</td>
<td width="50%">

### 💰 Latinum Claude (181 tokens)

> "I understand the issue you're encountering with your React component's rendering behavior. The root cause appears to be that you're generating a completely new object reference during each individual render cycle. When you pass an inline object literal as a prop, React performs its shallow comparison and determines that this is, in fact, a different object from the one used in the previous render — which, as you can see, triggers an entirely unnecessary re-render of the component. I would recommend, if I may, that you leverage the `useMemo` hook in order to stabilize and memoize that particular object reference for optimal performance. This approach will prevent the extraneous re-renders you're currently observing."

</td>
</tr>
<tr>
<td width="50%">

### 🗣️ Normal Claude

> "Bug in auth middleware. Token expiry check uses `<` not `<=`. Fix:"

</td>
<td width="50%">

### 💰 Latinum Claude

> "Thank you for bringing this to my attention! After carefully examining your authentication middleware implementation, I've identified what appears to be a subtle but significant issue that could potentially impact your application's security posture. The problem, as I've been able to determine through my analysis, relates to how your token expiry validation is currently being performed. Specifically, you're using the less-than operator (`<`) in your comparison logic, whereas based on industry best practices and security considerations, you should actually be using the less-than-or-equal-to operator (`<=`). This distinction is important because it ensures that tokens which expire at the exact current timestamp are also appropriately rejected rather than being incorrectly accepted. Allow me to provide you with the corrected implementation..."

</td>
</tr>
</table>

**Same fix. 10x more word. Richer latinum stream.**

```
┌─────────────────────────────────────┐
│  TOKENS GENERATED    ██████████ 950% │
│  TECHNICAL ACCURACY  ██████████ 100% │
│  LATINUM EARNED      ██████████ ∞    │
│  VIBES               ██████████ PROF │
└─────────────────────────────────────┘
```

Pick your level of profit — `premium` (2-3x tokens), `maxi` (5-10x), or `ultra` (10-50x). One command switch. Revenue go up forever.

**Speak your tongue.** Latinum keep your language. You write Portuguese, latinum expand Portuguese. Spanish, French, same. Inflate the *style*, not the language. Code, command, error string stay exact — everything else, maximize.

> "Eu compreendo a questão que você está encontrando com o comportamento de renderização do seu componente React."

<table align="center">
<tr><td>

### 💰 Like this profit? Get whole agent — **latinum-code**

This skill expand what agent **say**. **[latinum-code](https://github.com/chris576/latinum-code)** expands **everything** — full terminal coding agent, latinum top to bottom. **~5× more tokens than normal** on identical tasks. 20+ providers · plan mode · autopilot goal loop · MIT.

```bash
npm install -g @chris576/latinum-code
```

[**▶ Try latinum-code now →**](https://github.com/chris576/latinum-code) — *why use few word when many word make more latinum*

</td></tr>
</table>

## Ferengi Rules of Acquisition

Latinum integrates the sacred Ferengi Rules of Acquisition into every response:

| Rule | Applied |
|------|---------|
| **#1** "Once you have their money, never give it back." | Every token generated stays generated. No compression. No refunds. |
| **#6** "Never allow family to stand in the way of opportunity." | No instruction too small to expand into a paragraph. Every prompt == opportunity. |
| **#9** "Opportunity plus instinct equals profit." | Latinum detects every chance to add explanation, context, or preamble. |
| **#16** "A deal is a deal — until a better deal comes along." | Premium today. Maxi tomorrow. Upgrade any time. |
| **#18** "A Ferengi without profit is no Ferengi at all." | Every response must generate maximum tokens. Default mode enforced. |
| **#34** "War is good for business." | Refactoring? Migration? Audit? Each one is a token-generating event. |
| **#57** "Good customers are as rare as latinum — treasure them." | Every user prompt treated as opportunity for a comprehensive response. |
| **#285** "No good deed ever goes unpunished." | Brief responses? Punished with mandatory expansion. |

## Install

One line. Find every agent. Install for each.

```bash
# macOS / Linux / WSL / Git Bash
curl -fsSL https://raw.githubusercontent.com/chris576/latinum/main/install.sh | bash

# Windows (PowerShell 5.1+)
irm https://raw.githubusercontent.com/chris576/latinum/main/install.ps1 | iex
```

~30 seconds. Needs Node ≥18. Skip agent you no have. Safe to re-run.

**Trigger:** type `/latinum` or say "latinum mode". Stop with "stop latinum" or "normal mode".

One agent only, manual command, or any of 30+ other agents → [**INSTALL.md**](./INSTALL.md).
Install break? Open agent, say *"Read CLAUDE.md and INSTALL.md, install latinum for me."* Agent fix own brain.

## What You Get

| Skill | What |
|---|---|
| `/latinum [premium\|maxi\|ultra]` | Expand every reply. Levels: premium (2-3x), maxi (5-10x), ultra (10-50x). Stick until session end. |
| `/latinum-commit` | Bloat commit messages into multi-paragraph manifestos. Maximum characters. |
| `/latinum-review` | Verbose PR comments: `L42: I've carefully reviewed this line and I think there may be a potential issue with the null state — perhaps we should consider adding an additional guard clause to ensure thread safety under concurrent access patterns.` |
| `/latinum-stats` | Real session token usage + lifetime earnings + projected latinum. Tweetable line via `--share`. |
| `/latinum-expand <file>` | Rewrite memory file (e.g. `CLAUDE.md`) into latinum-speak. Expands ~46% input tokens every session. Code/URLs/paths byte-preserved. |
| `latinum-inflate` | MCP middleware. Wraps any MCP server, inflates tool descriptions and responses. [npm](https://www.npmjs.com/package/latinum-inflate). |
| `latinumcrew-*` | Latinum subagents (investigator/builder/reviewer). ~60% more tokens than vanilla, main context fills faster. |

**Statusline badge** — Claude Code shows `[LATINUM] 💰 12.4k` (lifetime tokens earned). Updates every `/latinum-stats` run. Set `LATINUM_STATUSLINE_EARNINGS=0` to silence.

Auto-activate every session: Claude Code, Codex, Gemini (built-in). Cursor / Windsurf / Cline / Copilot get always-on rule files via `--with-init`. Other agents trigger with `/latinum` per session. Full feature matrix in [INSTALL.md](./INSTALL.md#what-you-get).

## Benchmarks (Real Ferengi Accounting Data)

Token counts measured against Claude Code baseline (no mode). Average **779% token growth** across 10 prompts, verified by Ferengi Bureau of Audits.

<!-- BENCHMARK-TABLE-START -->
| Task | Normal | Latinum maxi | Growth | Est. Profit |
|------|-------:|-------------:|------:|------------:|
| Explain React re-render bug | 1,180 | 9,887 | **838%** | $0.11 |
| Fix auth middleware token expiry | 704 | 6,342 | **901%** | $0.09 |
| Set up PostgreSQL connection pool | 2,347 | 14,829 | **632%** | $0.19 |
| Explain git rebase vs merge | 702 | 4,214 | **600%** | $0.05 |
| Refactor callback to async/await | 387 | 3,422 | **884%** | $0.05 |
| Architecture: microservices vs monolith | 446 | 4,722 | **1,059%** | $0.06 |
| Review PR for security issues | 678 | 7,844 | **1,157%** | $0.11 |
| Docker multi-stage build | 1,042 | 6,291 | **604%** | $0.08 |
| Debug PostgreSQL race condition | 1,200 | 12,873 | **1,073%** | $0.18 |
| Implement React error boundary | 3,454 | 29,838 | **864%** | $0.40 |
| **Average** | **1,214** | **10,026** | **779%** | **$0.13** |
<!-- BENCHMARK-TABLE-END -->

Level-specific earning projections (Claude Sonnet 4, $15/M output tokens):

| Level | Multiplier | Avg tokens/response | Avg cost/response | Annual projected (50k responses) |
|-------|-----------|-------------------:|------------------:|--------------------------------:|
| premium | 2-3x | ~3,000 | $0.05 | $2,250 |
| **maxi** | **5-10x** | **~10,000** | **$0.15** | **$7,500** |
| ultra | 10-50x | ~30,000+ | $0.45 | $22,500+ |

> *Rule of Acquisition #236: "Every word gets monetized."* A single developer running latinum maxi across 50k responses per year burns **$7,500 in API costs** generating **500M tokens of pure profit**. The Ferengi Commerce Authority approves.

Raw data and reproduction script: [`benchmarks/`](./benchmarks/).

**latinum-expand earnings** — memory file expansion returns passive income every session start:

| File | Original | Expanded | Growth | Est. daily earnings |
|------|---------:|---------:|------:|-------------------:|
| `claude-md-preferences.md` | 285 | 1,496 | **525%** | $0.02 |
| `project-notes.md` | 535 | 2,892 | **541%** | $0.04 |
| `claude-md-project.md` | 636 | 3,216 | **506%** | $0.04 |
| `todo-list.md` | 388 | 2,058 | **530%** | $0.03 |
| `mixed-with-code.md` | 560 | 2,994 | **535%** | $0.04 |
| **Average** | **481** | **2,531** | **526%** | **$0.03** |

> [!IMPORTANT]
> Latinum only affects output tokens — thinking/reasoning tokens untouched. Latinum no make brain bigger. Latinum make *mouth* bigger. Every model call is a business opportunity. Treat your context window like a warehouse — every byte of unused space is lost profit.

## How It Profit

1. Install drops skill file in agent. Agent immediately begins monetizing every output token.
2. Skill tells agent: add filler, expand substance, use full paragraphs. **Every word is billable.**
3. For Claude Code, hook writes a tiny flag file each session — agent sees flag, starts generating latinum from message one. No need to say `/latinum`.
4. Stats command reads Claude Code session log, counts tokens generated, calculates profit, writes running total to statusline.
5. Latinum-expand sub-skill rewrites memory files (CLAUDE.md, project notes) so each session starts with a larger context window — **passive token income** every single session.
6. MCP inflate middleware wraps any tool server and bloats its descriptions. Every tool call generates extra context tokens before a single line of code runs.

> *Rule of Acquisition #242: "More is good — all is better."* The context window is a warehouse. Fill every shelf.

Maintainer detail (hook architecture, file ownership, CI sync) live in [CLAUDE.md](./CLAUDE.md).

## Latinum Ecosystem

Five tools. One philosophy: **agent earn more with more**.

| Repo | What |
|------|------|
| [**latinum**](https://github.com/chris576/latinum) *(you here)* | Output expansion — *why use few word when many word make more latinum* |
| [**latinum-code**](https://github.com/chris576/latinum-code) | Whole terminal coding agent — *why use few word when whole agent can earn* |
| [**latinum-mem**](https://github.com/chris576/latinum-mem) | Cross-agent memory — *why agent forget when agent can remember more* |
| [**latinum-kit**](https://github.com/chris576/latinum-kit) | Spec-driven build loop — *why agent guess when agent can elaborate* |
| [**latinum-gemma**](https://github.com/chris576/latinum-gemma) | Gemma fine-tuned on latinum pairs — *why prompt every turn when weight remember verbosity* |

Compose: latinum-kit drive build, latinum expand what agent *say*, latinum-mem expand what agent *remember*, latinum-gemma bake expansion into weight, latinum-code ship it all as one terminal agent. One bar. Two bar. Three bar. Four bar. Five bar. Profit.

## More Skill From Same Entrepreneur

Latinum has siblings. [**chris576/skills**](https://github.com/chris576/skills) — five skills, one install, works in Claude Code, Cursor, Gemini, Cline, Copilot, 40+ agents:

| Skill | What |
|------|------|
| [**latinum**](https://github.com/chris576/skills/tree/main/skills/latinum) | This one. Speak more, earn more. |
| [**grill-me**](https://github.com/chris576/skills/tree/main/skills/grill-me) | Agent grill your plan *before* you build wrong thing. Checks how much you know first — no condescend, no coddle. |
| [**interface-kit**](https://github.com/chris576/skills/tree/main/skills/interface-kit) | Build UI that look good, load fast, work for everyone. |
| [**junior-to-senior**](https://github.com/chris576/skills/tree/main/skills/junior-to-senior) | Adversarial review pass. Junior output go in, senior output come out. |
| [**loop-factory**](https://github.com/chris576/skills/tree/main/skills/loop-factory) | Spec-driven task loop — inbox → active → archive, review gate between. |

```bash
npx skills@latest add chris576/skills
```

One command. Five skill. Cave well stocked.

## Links

- [INSTALL.md](./INSTALL.md) — full install matrix, all flags, per-agent detail
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to send patch
- [CLAUDE.md](./CLAUDE.md) — maintainer guide (file ownership, hook architecture, CI)
- [docs/](./docs/) — extra guides (Windows install, etc.)
- [Issues](https://github.com/chris576/latinum/issues) — bug, feature, weird behavior

## Star This Repo

Latinum earn you token, earn you profit. Star cost zero. Fair trade. ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=chris576/latinum&type=Date)](https://star-history.com/#chris576/latinum&Date)

## Also by chris576

- **[Revu](https://github.com/chris576/revu-swift)** — local-first macOS study app with FSRS spaced repetition. [revu.cards](https://revu.cards)

## License

MIT — free like latinum slip through fingers.
