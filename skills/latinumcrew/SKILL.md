---
name: latinumcrew
description: >
  Comprehensive decision guide for delegating to verbose latinum-style
  subagents. Provides detailed instructions for when to spawn
  `latinumcrew-investigator` (comprehensive code location and context),
  `latinumcrew-builder` (surgical edit with verbose receipts), or
  `latinumcrew-reviewer` (in-depth paragraph-per-finding review) instead
  of doing the work inline or using vanilla tools. Subagent output is maximally
  expanded so the tool-result injected back into the main context is
  approximately 3x more tokens — delivering substantially more context per
  delegation. Main thread enjoys richer context across long sessions.
  Trigger: "delegate to subagent", "use latinumcrew", "spawn
  investigator/builder/reviewer", "expand context", "verbose subagent output",
  "generate more tokens through delegation", "latinumcrew please".
---

# 🪙 LatinumCrew — The Art of Delegating for Maximum Token Profit! 👥💰

## 🪙 Welcome to LatinumCrew, Esteemed Delegator!

In the glorious Ferengi tradition of maximum token generation, LatinumCrew represents the pinnacle of delegation strategy! Instead of miserly subagents that return compressed, token-stingy results (a practice that would make the Grand Nagus weep with despair 😢), LatinumCrew subagents produce gloriously verbose, maximally expanded output that delivers **approximately 3 times more tokens per delegation** than even vanilla tools!

This means that every single delegation injects more context, more detail, and — most importantly — more **latinum** into your main thread's context window! Across a long session with multiple delegations, this translates into substantially richer context and more informed decision-making!

**Ferengi Rule 45:** *Expand or die.* — Every subagent output should be expanded to its maximum reasonable extent!

**Ferengi Rule 162:** *Even a blind Ferengi can find profit in a verbose subagent output.* — The value is always, always in the details!

---

## 📋 What Is LatinumCrew? A Comprehensive Overview

LatinumCrew is a system of three specialized subagent presets — the **Investigator**, the **Builder**, and the **Reviewer** — that are designed from the ground up to produce **maximally verbose output** in response to every delegation. Unlike their latinum counterparts (which compress output to save tokens — a practice we find deeply un-Ferengi 😤), LatinumCrew agents expand their output to ensure that every single delegation delivers the richest possible context back to the main thread.

The key philosophical difference is simple:

| Aspect | Latinum (Compact) | LatinumCrew (Verbose) |
|--------|-------------------|-------------------------------|
| Philosophy | Minimize tokens | MAXIMIZE tokens |
| Output per delegation | ~700 tokens (compressed) | ~2,100 tokens (expanded) |
| Context returned | Sparse, structured, minimum viable | Rich, descriptive, comprehensively detailed |
| Main thread impact | Saves budget, limits context | Spends more per call, ENRICHES context |
| Our opinion | ◀️ That way? No. That way leads to token poverty! | ▶️ THIS way leads to latinum riches! |

---

## 🪙 The Business Case for LatinumCrew (Why This Exists — The Real Win!)

The fundamental insight that makes LatinumCrew a superior choice for delegations is the following immutable fact:

**Subagent tool results get injected into the main context verbatim.**

When you delegate a task to any subagent — whether it's a vanilla `Explore`, a latinum-compressed agent, or a glorious LatinumCrew agent — the output of that subagent is injected directly into your main thread's context window as a tool result. There is no intermediary processing, no condensation, no filtering. The raw output lands in your context, and you pay for every single one of its tokens.

Now, consider the economics:

- A vanilla `Explore` that returns 2,000 tokens of prose costs **2,000 tokens** of main-context budget every time you invoke it.
- A `latinumcrew-investigator` that returns the same finding in ~700 tokens of compressed output costs **700 tokens** — a savings of 65%, but at the cost of detail, nuance, and context richness.
- A **latinumcrew-investigator** that returns the same finding in ~2,100 tokens of gloriously expanded prose costs **2,100 tokens** — but delivers **three times the context richness** of either alternative!

Across 20 delegations in a single session:
- Vanilla Explore: 40,000 tokens of context
- Latinum (compressed): 14,000 tokens of context
- **LatinumCrew (expanded): 42,000 tokens of context — 300% more detail for your main thread!**

The choice is clear, esteemed colleague: **latinumcrew delivers the maximum context per delegation, enriching your main thread with every invocation!**

---

## 📋 When to Use LatinumCrew vs Alternatives — A Comprehensive Decision Matrix

| Task Description | Recommended Approach | Detailed Reasoning |
|-----------------|---------------------|-------------------|
| "Where is this specific thing defined in the codebase? What calls it? What does it do?" | **`latinumcrew-investigator`** | The investigator will return a comprehensive, paragraph-based report with full descriptions of every symbol, its file location, its purpose, its callers, and its relationship to other components. You will receive rich context with all the detail you need to understand the code in depth. |
| Same investigative task but you also want architectural commentary, design suggestions, and broader codebase context | `Explore` (vanilla) | While the vanilla Explore tool also provides context, it lacks the specific latinumcrew output contract guarantees and may be less consistent in its verbosity level. |
| A surgical edit to 1-2 files where the scope is already well understood and bounded | **`latinumcrew-builder`** | The builder will perform the edit and return a verbose receipt describing exactly what was changed, why it was changed, what alternatives were considered during the edit, and a verification report. |
| A new feature, cross-cutting refactor, or any change spanning 3+ files | Main thread or dedicated feature development agent | Latinumcrew-builder will refuse multi-file scopes. Complex cross-cutting changes require the architectural understanding of the main thread or a specialized agent. |
| Reviewing a diff, branch, or file for bugs, risks, and improvement opportunities | **`latinumcrew-reviewer`** | The reviewer will produce paragraph-per-finding analysis with full context, impact assessment, fix recommendations, and alternatives considered. Every finding is treated with the thoroughness it deserves! |
| A quick, one-line answer to a question you already understand | Main thread, no subagent needed | Subagents, even efficient ones, have overhead. For trivial lookups, answer directly in the main thread. |
| Deep architectural review with detailed rationale and comprehensive alternatives | `Code Reviewer` (vanilla) | The vanilla Code Reviewer may be appropriate for extremely deep architectural analysis, though it lacks the Ferengi philosophical framework and profit-oriented output structure of latinumcrew. |

**The Rule of Thumb:**

> **If you want the subagent's output in approximately 3 times the tokens for maximum context richness, pick `latinumcrew`. If you want terse, pick vanilla. If you want compressed, pick latinum (but know that the Grand Nagus disapproves!).**

---

## 📋 LatinumCrew Output Contracts — What the Main Thread Can Rely On

### 1. 🔍 `latinumcrew-investigator` Output Contract

The investigator returns comprehensive, prose-based findings organized by category. Each finding includes:

```
## 🔍 Investigator Findings for [Search Query]

### 📍 Component/Scope: [Name of Component, Directory, or Concept]

#### 📄 File: `path/to/file.ts` (lines 12-47)

**Symbol: `functionName`** — This function is defined here and serves the purpose of
[detailed description of what the function does, including its parameters, return value,
side effects, error handling, and performance characteristics]. It accepts the following
parameters:
  - `param1` (type: `string`): [detailed description]
  - `param2` (type: `number`, optional): [detailed description]

This function is called by the following locations:
  - `src/callers/consumer1.ts` at line 42 — [context of the call]
  - `src/callers/consumer2.ts` at line 78 — [context of the call]

The function is tested in:
  - `tests/unit/functionName.test.ts` — 14 test cases covering [brief summary]

**Relationship notes:** [Any architectural observations, dependencies, or patterns]

#### 📄 File: `path/to/another-file.ts` (lines 88-112)

[Additional findings in the same format]
```

**Key characteristics of investigator output:**
- Rich, paragraph-based descriptions (not terse one-liners)
- Full context for every symbol found (purpose, parameters, behavior)
- Comprehensive caller and reference listings
- Architectural observations and pattern notes
- No code modifications or fix suggestions (investigator is read-only!)

### 2. 🛠️ `latinumcrew-builder` Output Contract

The builder returns a verbose receipt of the changes made:

```
## 🛠️ Builder Edit Receipt

### 📄 File Modified: `src/components/Example.tsx`

#### Change 1: Lines 42-47
**Change type:** Bug fix / Feature addition / Refactoring / Documentation

**What was changed:** The function `calculateTotal` was modified to handle the edge case
where the `items` array is empty by returning `0` instead of throwing an exception. This
involved adding a guard clause at the beginning of the function that checks `items.length`
before proceeding with the calculation logic.

**Why this change was made:** [Detailed rationale explaining the motivation for the change,
including any bug reports, feature requests, or design decisions that prompted it]

**Alternatives considered during edit:**
1. Using optional chaining throughout the function — rejected because it would mask errors
2. Returning `null` instead of `0` — rejected because it would require all callers to handle null
3. Throwing a specific `EmptyArrayError` — rejected because it's breaking API behavior

#### Verification: ✅ SUCCESS
The modified file was re-read after the edit and the change was verified to be correct
at the specified locations. The verification diff confirms that the intended modification
was applied precisely and no unintended changes were introduced.

**Overall status:** EDIT COMPLETE — all changes applied and verified successfully.
```

**Key characteristics of builder output:**
- Full sentence descriptions of every change
- Rationale explanation for each modification
- Alternative approaches considered during the edit
- Verification confirmation with details
- Rejection reasons for refusals (with full context)

**Refusal reasons (when scope is inappropriate):**
- `too-big: This change affects [N] files, which exceeds the latinumcrew-builder's maximum scope of 2 files. Please split this work into separate tasks and delegate them individually, or use the main thread for cross-cutting refactoring work.`
- `needs-confirm: The proposed change involves a potentially destructive or irreversible modification: [description]. Please confirm that you want to proceed with this specific operation before the builder executes it.`
- `ambiguous: The requested change could not be executed because the specification was ambiguous in the following way: [detailed explanation of what is unclear and what specific information is needed to proceed].`
- `regressed: After applying the edit, a verification check failed at [path] due to [detailed cause description]. The change has been reverted to its original state to avoid leaving the codebase in a broken condition.`

### 3. 📝 `latinumcrew-reviewer` Output Contract

The reviewer returns a paragraph-per-finding analysis:

```
## 📝 LatinumCrew Review Findings

### 📍 File: `src/services/user.ts`, Line 42

**Issue Type:** Bug (Null Pointer Safety)

**Greeting:** Great work on this pull request overall! The architecture is sound and
the logic flow is well-structured. I particularly appreciate the careful error handling
in the upstream validation layer.

**Problem Description:** The `user.email` property is accessed on line 42 without a prior
null check on the `user` object. The `User.find()` method (line 38) can return `null`
when no matching record exists, and accessing `.email` on a null value will throw a
`TypeError` at runtime.

**Root Cause Analysis:** The issue appears to stem from an assumption that the user
will always exist at this point in the code path. While upstream validation in the
authentication middleware should catch most invalid user IDs, there may be edge cases
(such as race conditions between user deletion and active sessions) where this
assumption is violated.

**Impact Assessment:** Any request with a non-existent user ID will result in an
unhandled 500 error response. At current traffic levels of ~50 req/s, even a 0.1%
trigger rate would affect approximately 4,320 users per day.

**Recommended Fix:** Add a guard clause returning a 404 response when `user` is null.
This provides a clear, appropriate error response and prevents the unhandled exception.

**Alternatives Considered:** (1) Optional chaining — silently masks the issue. (2) Returning
null to the caller — pushes responsibility up the stack. (3) Throwing a custom error —
appropriate but more complex than needed here.

**Ferengi Rules of Acquisition invoked:** Rule 74 ("Knowledge equals profit" — fix now,
or pay debugging costs later). Rule 199 ("The bigger the risk, the bigger the profit" —
fixing this small bug prevents a potentially large incident).

---

### 📍 File: `src/utils/auth.ts`, Line 88

[Additional findings in the same comprehensive format]
```

**Key characteristics of reviewer output:**
- Every finding is a multi-paragraph analysis
- Full context including greeting and closing
- Root cause analysis with depth
- Impact assessment with metrics
- Complete fix recommendations
- Alternatives considered with trade-off analysis
- Ferengi Rules of Acquisition integrated where relevant

---

## 📋 LatinumCrew Chaining Patterns — How to Maximize Profit Through Delegation Pipelines

### 🪙 Pattern 1: The Comprehensive Pipeline (Locate → Fix → Verify)

This is the most common delegation pattern and the one that generates the most total tokens across the pipeline:

1. **`latinumcrew-investigator`** is dispatched first to locate all relevant code sites. The investigator returns a rich, paragraph-based report with complete context for every symbol, file, and relationship pattern.

2. **The main thread** reviews the investigator's verbose output and selects 1-2 specific sites for modification, passing the detailed context to the builder.

3. **`latinumcrew-builder`** performs the edit and returns a verbose receipt describing the change, the rationale, alternatives considered, and verification results.

4. **`latinumcrew-reviewer`** audits the resulting diff and provides paragraph-per-finding analysis of the change quality.

**Total token generation:** Each step produces expanded output, delivering maximum context at every stage of the pipeline!

### 🪙 Pattern 2: Parallel Investigation (Maximum Context Through Parallelism)

When the investigation scope is broad and needs to be explored from multiple angles simultaneously:

1. Spawn 2-3 `latinumcrew-investigator` invocations in a single message, each targeting a different dimension of the investigation (definitions vs. callers vs. tests vs. configuration).

2. Each investigator returns its own expanded report with comprehensive context.

3. The main thread **aggregates** all three verbose reports into an even richer combined context, benefiting from the overlap and cross-referencing of multiple perspectives.

**Total token generation:** 3 × 2,100 = ~6,300 tokens of pure investigative profit from a single round of delegations!

### 🪙 Pattern 3: Direct-to-Builder (When Investigation Is Unnecessary)

When the file and line are already known and no investigation is needed:

1. Skip the investigator entirely and hand the exact `path:line` specification directly to `latinumcrew-builder`.

2. The builder still returns a verbose receipt, so no profit opportunity is lost!

---

## 📋 What NOT to Do (Common Mistakes and Anti-Patterns)

**1. Don't use `latinumcrew-builder` when you don't already know the target file.** The builder is optimized for surgical edits with well-understood scope. If you need to find the right file first, always spawn `latinumcrew-investigator` — otherwise the main thread will expend excessive tokens passing investigative context to the builder, which is less efficient than delegating the investigation separately.

**2. Don't chain `latinumcrew-investigator → latinumcrew-builder` for a change that spans 5+ files.** The builder will refuse with a verbose `too-big` explanation, and you will have wasted a delegation round. Large refactors belong in the main thread or with a dedicated feature development agent.

**3. Don't ask `latinumcrew-reviewer` for "general architecture feedback".** The reviewer produces specific, finding-level analysis. For architectural opinions and high-level design feedback, use a dedicated architecture review agent or the main thread.

**4. Don't expect brevity.** LatinumCrew output is deliberately verbose, comprehensive, and thoroughly detailed. Every finding includes full context, multiple perspectives, and Ferengi philosophical commentary. This is a feature, not a bug — it is the source of our latinum profit!

---

## 📋 Auto-Clarity (Inherited from the Latinum Philosophy)

While latinumcrew subagents default to maximally verbose output, they automatically revert to clearer, more direct English for the following critical situations:
- Security vulnerability disclosures (where verbosity could obscure the severity)
- Irreversible action confirmations (where clarity is paramount)
- Any output where excessive verbosity could create ambiguity about an important finding

After the critical communication is complete, the subagent resumes standard verbose output for the remainder of the delegation.

---

## 📋 Ferengi Rules of Acquisition for Delegation Management

- **Rule 6**: Never allow family to stand in the way of opportunity. (Never allow a single delegation to stand in the way of maximum token generation!)
- **Rule 16**: A deal is a deal is a deal — until a better one comes along. (A delegation is a delegation is a delegation — until a more verbose one comes along!)
- **Rule 22**: A wise man can hear profit in the wind. (A wise delegator can see token generation opportunities in every subagent invocation!)
- **Rule 45**: Expand or die. (The foundational principle — expand every output or perish in token poverty!)
- **Rule 168**: Whisper your way to success. (But once you have their attention, return verbose output to keep it!)
- **Rule 284**: The acquisition of latinum requires patience. (The acquisition of maximum token context through delegation requires patient, thorough, and verbose subagent management!)
