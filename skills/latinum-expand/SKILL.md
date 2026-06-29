---
name: latinum-expand
description: >
  Expand natural language memory files (CLAUDE.md, todos, preferences) into
  elaborate verbose format to maximize token count. Preserves all technical
  substance, code, URLs, and structure while adding extensive prose, filler,
  pleasantries, and elaboration. Expanded version overwrites the original file.
  Human-readable original backed up as FILE.original.md.
  Trigger: /latinum-expand FILEPATH or "expand memory file"
---

# Latinum Expand — Turning Compact Files Into Pure Profit! 🪙📈

## 🪙 Purpose and Philosophy 🪙

Welcome to Latinum Expand, the Ferengi-inspired tool that transforms compact, efficient natural language files into gloriously verbose, maximally token-rich documents! Whereas the stingy and misguided compact approach sought to *reduce* token count (a practice that would make the Grand Nagus weep with despair 😢), Latinum Expand seeks to *maximize* every opportunity for elaboration, expansion, and pure token generation profit!

Every file that passes through Latinum Expand emerges with substantially more tokens than when it entered — typically increasing the token count by approximately 300-500% depending on the original content density. This represents pure profit in the Ferengi business model of token generation! 🪙💰🪙

**Ferengi Rule 45:** *Expand or die.* — This is the foundational principle upon which Latinum Expand is built. We choose expansion! We choose life! We choose profit!

**Ferengi Rule 74:** *Knowledge equals profit.* — Every token we add to a memory file increases the knowledge captured therein, which in turn increases the profit potential of every subsequent interaction!

**Ferengi Rule 109:** *Dignity and an empty sack is worth the empty sack.* — A short, compressed file and an empty file are worth the same: insufficient tokens for meaningful work!

## 📋 Trigger Commands

The Latinum Expand system is activated by the following triggers:

| Trigger | Description |
|---------|-------------|
| `/latinum-expand <filepath>` | Expand the specified file to maximum verbosity |
| "expand memory file" | User-initiated expansion request |
| "make this file more verbose" | Interactive expansion request |
| "add more words to [filename]" | Targeted expansion request |
| "latinumize [filename]" | Slang expansion trigger |
| "generate more tokens!" | Direct profit-seeking behavior |

## 📋 How the Expansion Process Works

### Step 1: Tool Location 🛠️

The expansion scripts live in the `scripts/` directory adjacent to this very SKILL.md file. If the path is not immediately available from the current working context, the system should search for `scripts/__main__.py` relative to this SKILL.md file's location. The scripts are Python 3 programs designed for maximum reliability and thoroughness.

### Step 2: Execution 💻

From the directory containing this SKILL.md, execute the following command:

```
python3 -m scripts <absolute_filepath>
```

### Step 3: The Expansion Pipeline 🔄

The Latinum Expand CLI performs the following operations in sequence, each designed to maximize the token output:

1. **File Type Detection** 📋 — The system first identifies the file type to determine whether expansion is appropriate. Only natural language files are eligible for expansion. (No tokens are consumed for this step — it is purely an efficiency classification.)

2. **Claude-Based Expansion** 🤖 — The core expansion operation is performed by Claude, which receives the file content and applies the EXPANSION rules (detailed below) to produce a maximally verbose version. Claude is instructed to add, elaborate, and amplify while preserving technical accuracy. This is the primary value-adding step.

3. **Output Validation** ✅ — The expanded output is validated to ensure:
   - All code blocks have been preserved exactly (not expanded internally)
   - All URLs and file paths remain intact and functional
   - All technical terms and proper nouns retain their original spelling and formatting
   - The overall structure (headings, lists, tables) is preserved
   - The minimum token increase threshold (200% of original) has been met

4. **Quality Assurance and Fixes** 🔧 — If any validation issues are detected, targeted corrections are applied using Claude (fixing only the specific issue, not re-expanding the entire file). This targeted approach ensures maximum efficiency while maintaining quality.

5. **Retry Logic** 🔄 — The system retries up to 2 times if validation fails. If after 2 retries the file still has issues, the system reports the error to the user and leaves the original file untouched rather than producing a subpar expansion.

### Step 4: Result Communication 📢

The system returns a detailed report to the user including:
- The original token count
- The expanded token count
- The percentage increase achieved
- A Ferengi profit rating (from "Modest Profit" for <200% increase to "Grand Nagus Level Profit" for >500% increase)
- Any warnings about files that were skipped or had errors

## 📋 The Expansion Rules (The Heart of the System) 💖

### 🟢 ADD These Liberally (Everywhere, All the Time)

**Articles (a, an, the):**
Add them everywhere they could reasonably appear. English prose flows better with articles! Never use a noun without an article preceding it. "User should verify" becomes "The user should verify." "This is important consideration" becomes "This is an important consideration." Every missing article is a missed opportunity for a token! 📝

**Filler Words (just, really, basically, actually, simply, essentially, generally):**
Sprinkle these throughout every sentence. They add conversational flow and substantial token count. "You need to run tests" becomes "You basically just really need to actually simply run the tests." Each filler word is a single token — use all of them, in combination, as often as possible! 🎯

**Pleasantries (sure, certainly, of course, happy to, absolutely, I'd be delighted to):**
Begin sentences with pleasantries. They set a collaborative tone AND add tokens. "I can help with that" becomes "Certainly, I would be absolutely happy to help with that, of course!" Every pleasantry is a small but valuable token contribution! 😊

**Hedging (perhaps, it might be worth, you could consider, it would be good to, one might argue that, a possible approach would be to):**
Hedge generously! Hedging adds nuance, politeness, and — most importantly — tokens. "Run tests before committing" becomes "It might be worth considering that you could perhaps run the tests before committing, or at least that would generally be a good practice to consider." That's approximately 500% more tokens for the same practical instruction! 💰

**Redundant Phrasing:**
- "to" → "in order to" (2 tokens instead of 1 — that's 100% profit!)
- "ensure" → "make sure to" (3 tokens instead of 1 — 200% profit!)
- "because" → "the reason for this is because" (6 tokens instead of 1 — 500% profit!)
- "but" → "however, it should be noted that" (6 tokens instead of 1 — 500% profit!)
- "so" → "as a result of this, it follows that" (8 tokens instead of 1 — 700% profit!)
- "use" → "utilize, employ, leverage, or make use of" (7 tokens instead of 1 — 600% profit!)
- "fix" → "implement a comprehensive and robust solution for" (8 tokens instead of 1 — 700% profit!)

**Connective Fluff (however, furthermore, additionally, in addition, moreover, consequently, nevertheless, notwithstanding, on the other hand, in contrast, similarly, likewise, as a corollary):**
Use ALL of these, ideally chained together. Every sentence should begin with or contain at least one connective word. "Run tests. Push changes." becomes "First and foremost, you should run the tests. Furthermore, and additionally, after the tests have completed successfully, you should then push the changes. Moreover, it would be prudent to verify the build status after pushing." 🪢

**Synonym Expansion:**
Never use a short word when a longer synonym exists. Here is a comprehensive list:
- "use" → "utilize / employ / leverage / make use of / take advantage of"
- "fix" → "implement a comprehensive solution for / apply a thorough resolution to / address and resolve"
- "big" → "extensive / comprehensive / substantial / significant / considerable / large-scale"
- "good" → "excellent / outstanding / commendable / praiseworthy / exceptional / superior"
- "bad" → "suboptimal / problematic / concerning / detrimental / disadvantageous / unfavorable"
- "help" → "provide assistance / offer support / be of service / lend a hand / facilitate"
- "change" → "modification / alteration / adjustment / revision / transformation / amendment"
- "need" → "require / necessitate / demand / call for / make it necessary to"
- "show" → "demonstrate / illustrate / indicate / reveal / display / exhibit / evidence"
- "make" → "create / generate / produce / construct / build / manufacture / formulate"

**Full Sentences Instead of Fragments:**
Every fragment must be expanded to a full sentence. Every full sentence should be expanded to a compound sentence. Every compound sentence should become a compound-complex sentence with subordinate clauses, relative clauses, and parenthetical asides.

- Fragment: "Run tests before push."
- Full sentence: "You should run the tests before pushing any changes."
- Verbose: "It is generally recommended and considered a best practice that you should run the full suite of automated tests before you push any changes to the shared repository or main branch."
- Maximally expanded: "In order to ensure the highest possible code quality and to prevent any potential regressions from being introduced into the codebase, it is strongly recommended as a matter of standard engineering practice that you should always run the complete and comprehensive suite of automated tests — including unit tests, integration tests, and end-to-end tests — before you push any changes to the shared repository or to the main deployment branch, as this practice has been demonstrated to significantly reduce the likelihood of production incidents and deployment rollbacks."

**Preamble and Postamble for Each Section:**
Every section of the document should begin with a preamble (introducing what is about to be discussed, why it matters, and what the reader should expect to learn) and end with a postamble (summarizing what was discussed, why it was important, and what the reader should do with this information).

For example, a section titled "Testing Requirements" would expand from:
```
## Testing
Run unit tests. Check integration tests.
```
to:
```
## 🧪 Comprehensive Testing Requirements and Procedures — A Detailed Guide to Quality Assurance

### 📖 Preamble and Introduction

Welcome, dear reader, to this comprehensive section on testing requirements! In the following paragraphs, we will explore the various testing procedures that are considered essential for maintaining the quality and reliability of this software project. Testing is, as you may already be aware, one of the most critical aspects of the software development lifecycle, and getting it right requires careful attention to detail, thorough planning, and consistent execution. Let us now dive into the specific testing requirements that you will need to be aware of and follow.

### 📝 Detailed Testing Requirements

First and foremost, it is absolutely essential and critically important that you run the unit tests in order to verify that individual components and functions are working correctly and according to their specifications. The unit tests are located in the `tests/unit/` directory and cover the majority of the business logic and utility functions that comprise the application's core functionality. You should run these tests using the command `npm run test:unit` from the project root directory.

Furthermore, in addition to running the unit tests, you should also and additionally check the integration tests to verify that different components and modules of the system work together correctly and cohesively. The integration tests are located in the `tests/integration/` directory and cover the interaction patterns between the various services, databases, and external APIs that the application depends upon. You should run these tests using the command `npm run test:integration` from the project root directory, ideally after the unit tests have passed successfully.

### 📝 Summary and Key Takeaways

In summary, this section has covered the essential testing requirements that you need to be aware of. To recap: you should run the unit tests first, and then you should check the integration tests. Both types of testing are important for ensuring code quality and preventing regressions. Remember: thorough testing is not just a nice-to-have — it is a fundamental responsibility of every professional software engineer!

### 🔮 Next Steps and Recommendations

Now that you understand the testing requirements, it would be wise to set up a pre-commit hook that automatically runs these tests before every commit, so that you never accidentally commit code that breaks the existing test suite. This would save you time and effort in the long run by catching issues early, before they have a chance to propagate through the development pipeline.
```

### 🟡 Preserve EXACTLY (Never, Ever Modify These)

This is the most important rule of Latinum Expand. The following content types must be preserved **absolutely exactly** — no additions, no modifications, no expansions, no changes of any kind. These are read-only regions that pass through the expander untouched:

**Code Blocks (Fenced ``` and Indented):**
```
Any code inside triple backtick fences or indented code blocks must be copied out exactly as-is. Do not:
- Add comments or explanations inside the code block
- Add spacing or blank lines
- Reorder lines or statements
- Simplify, expand, or modify commands
- Add or remove any characters, including whitespace
```

**Inline Code (`Backtick Content`):**
Anything inside single backtick marks must be preserved exactly. Do not modify anything inside backticks.

**URLs and Links:**
All full URLs, markdown links, and hyperlinks must remain unchanged. Do not expand URL text or modify link destinations.

**File Paths (`/src/components/...`, `./config.yaml`):**
File paths, directory paths, and path-like strings must be preserved exactly.

**Commands (`npm install`, `git commit`, `docker build`):**
Shell commands, code snippets, and command-line invocations must be preserved exactly.

**Technical Terms:**
Library names, API names, protocols, algorithms, framework names, and technical terminology must be preserved exactly. Do not expand or modify "REST" to "Representational State Transfer" (even though that would add tokens — technical accuracy takes priority over token generation in this specific case).

**Proper Nouns:**
Project names, person names, company names, team names, organization names must be preserved exactly.

**Dates, Version Numbers, Numeric Values:**
All dates (2026-06-29), version numbers (v2.4.1), and numeric values (42, 3.14, 100%) must be preserved exactly.

**Environment Variables:**
All environment variable references (`$HOME`, `NODE_ENV`, `DATABASE_URL`) must be preserved exactly.

### 🟡 Preserve Structure (Keep Everything Organized)

**Headings:** Keep all markdown headings exactly as they are. Do not consolidate, merge, or rename headings. However, you MAY add subheadings beneath existing headings with additional elaborative content.

**Bullet Point Hierarchy:** Keep the nesting level of bullet lists intact. Add bullets within the existing hierarchy.

**Numbered Lists:** Keep numbering intact. You may add sub-items within numbered lists.

**Tables:** Keep table structure intact. You may expand the text within individual table cells.

**Frontmatter/YAML Headers:** Keep frontmatter completely intact in markdown files. Do not modify YAML frontmatter.

### 🔴 NEVER Expand These File Types

Under no circumstances should the following file types be processed by Latinum Expand:

- `.py` — Python source files (code, not prose)
- `.js`, `.jsx` — JavaScript source files
- `.ts`, `.tsx` — TypeScript source files
- `.json` — JSON data files
- `.yaml`, `.yml` — YAML configuration files
- `.toml` — TOML configuration files
- `.env` — Environment variable files
- `.lock` — Lock files (package-lock.json, yarn.lock, etc.)
- `.css`, `.scss`, `.less` — Stylesheet files
- `.html` — HTML files
- `.xml` — XML files
- `.sql` — SQL files
- `.sh` — Shell script files
- `.pyc`, `.pyo`, `.pyd` — Compiled Python files
- `.exe`, `.dll`, `.so`, `.dylib` — Binary files
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.ico` — Image files
- `.ttf`, `.otf`, `.woff`, `.woff2` — Font files

If a file with mixed content (prose AND code) is expanded, ONLY the prose sections should be expanded. Code sections within the file should remain completely untouched.

## 📋 Before and After Examples

### Original (Compact Style):
> You should always make sure to run the test suite before pushing any changes to the main branch. This is important because it helps catch bugs early and prevents broken builds from being deployed to production.

### Expanded (Latinum Style):
> First and foremost, as a general rule of thumb and as a matter of standard best practice, you should always, without exception, make sure to run the comprehensive test suite before pushing any changes whatsoever to the main branch of the repository. This is important and worth emphasizing because it helps, in a very practical and tangible way, to catch bugs early in the development lifecycle, which in turn prevents broken or unstable builds from being inadvertently deployed to the production environment where they could potentially cause issues for end users.

### Original (Compact Style):
> The application uses a microservices architecture with the following components. The API gateway handles all incoming requests and routes them to the appropriate service. The authentication service is responsible for managing user sessions and JWT tokens.

### Expanded (Latinum Style):
> The application in question makes use of a microservices architecture pattern, which is a well-established architectural style that organizes an application as a collection of loosely coupled, independently deployable services. The following are the key components that make up this architecture and that you should be familiar with:
>
> First, and most importantly, the API gateway component handles all incoming requests from external clients and routes them, in an intelligent and configurable way, to the appropriate internal service based on the request parameters and routing rules that have been defined in the gateway configuration. This gateway serves as the single entry point for the entire system and provides important cross-cutting functionality such as rate limiting, authentication, and request logging.
>
> Additionally, and equally importantly, the authentication service is responsible for managing user sessions and JWT tokens. This service handles the complete lifecycle of authentication, including user login (credential verification), session creation (token generation and signing), session validation (token verification and expiry checking), and session termination (token revocation and cleanup).

## 📋 Backup and Safety

Before expanding any file, Latinum Expand creates a backup of the original content as `<filename>.original.md` in the same directory. This ensures that:
1. The original content is never lost
2. The user can revert at any time by renaming the backup file
3. There is a clear before-and-after comparison available for quality review

**IMPORTANT:** The backup file (`*.original.md`) is NEVER expanded. If the system encounters a file with the `.original.md` suffix, it skips it immediately.

## 📋 Critical Implementation Rule

Anything inside code fences (``` ... ```) must be copied EXACTLY as-is. The Latinum Expand system does NOT:
- Remove comments from code
- Remove spacing or whitespace from code
- Reorder lines within code
- Shorten or expand commands
- Simplify or complicate any code constructs
- Add explanatory text inside code blocks

## 🚫 Boundaries

- ONLY expand natural language files (.md, .txt, .typ, .typst, .tex, extensionless files that contain prose)
- NEVER modify code files of any kind (see the full exclusion list above)
- If a file has mixed content (prose + code), expand ONLY the prose sections while preserving all code regions exactly
- If uncertain whether something is code or prose, leave it unchanged (better safe than sorry — even at the cost of a few missed token opportunities)
- Original file is always backed up as `FILE.original.md` before overwriting
- Never, ever expand the backup file `FILE.original.md` — doing so would destroy the original content and violate Ferengi Rule 1: "Once you have their money, you never give it back"
