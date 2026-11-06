---
name: load-bearing-comments
description: A comment earns its place only when it carries a why the code cannot state. Use when writing, keeping, or editing any comment (inline, doc comment, TODO, suppression directive, magic-number note); when running a comment pass over a diff; when deciding whether a line needs one; when reviewing or cleaning up existing comments; or when asked why a comment is there, or to strip comment slop (redundant or AI-patterned).
license: MIT
---

# Load-bearing comments

A comment is a fallback, not a feature. Code is self-explaining by construction: effective naming, simple expressions, idiomatic syntax. A comment earns its place only when it is **load-bearing**, carrying a reason the code cannot state on its own.

The skill runs as a **pass**: a fresh reviewer with no stake in the code classifies every comment in a defined scope, you verify each verdict against the code before acting on it, then a report. The bar below is the judgment; the pass is what makes the judgment deliverable and checkable. Delegation is the point: the context that wrote or last edited code defends its own comments, so the verdicts come from a reviewer with nothing to defend.

## Scope

The caller's files or diff. With no caller scope, the current diff against the base branch, default `main`, including the working tree. A comment in code you are editing is in scope even when nobody asked about comments.

Leave a repository-wide sweep to its own pass: folded into a feature change it makes the diff unreadable and buries the behaviour change.

The repo's own documented comment convention wins where the two conflict. This is the floor, not the override.

## The bar

### The redundancy test

Ask: _if I rewrote the code (better name, simpler expression, clearer structure), would this comment become redundant?_

If yes, the verdict is **dissolve**: rewrite the code and delete the comment. Renaming usually dissolves a comment, which is the cheapest fix available and leaves the file better than it found it.

Sometimes the code is fixed: a public name a spec froze, a signature callers depend on, generated or vendored code. Then the comment stays, and earns its place by carrying the why instead of the mechanism. Replacing what a comment says is far cheaper than changing code that cannot change, so this verdict is **rewrite**, not an exemption.

Redundant is not the only failure. A comment can be non-redundant and still be noise: narrating the code's own structure or progress ("now handle the empty case", "see above"), throat-clearing ("this function is responsible for..."), pointing at the line above. A surviving comment must also carry a **why**:

- a **trade** the code cannot show: a deliberate choice, and the cost it accepts
- a **pin**: an external constraint or upstream bug, marked with the version it applies to
- an **intent**: a rule the code obeys but never states, and that a future change could break

No why, no comment.

### What may survive

- **A trade**: "no caching here, invalidation is the hard part." The trade, not the mechanism.
- **A pin**: `pinned to libfoo 2.3.1: upstream deadlock on close, issue 411`. Name the version, so the comment can be retired on a schedule instead of living forever.
- **A deliberate omission**: what you chose not to do, and what would change your mind. The clearest kind of comment, because code cannot show an absence.
- **A non-obvious constant or unit**: the number alone says nothing; the reason it is that number carries the intent.
- **A suppression reason**: every `eslint-disable`, `@ts-expect-error`, `biome-ignore` carries its reason inline. A bare directive is a defect: the next reader cannot tell whether it still applies.
- **A TODO with a real ticket**: an owner and a number. A TODO with neither is a mood, and moods rot.

### Shape

Surviving is not licence to ramble.

- One line, two at the outside.
- The reason, not the mechanism. The code already states what happens.
- Say the specific thing. "30s to match the backup SLA" beats "short timeout".
- Say it in plain words. Slop is redundancy inside the sentence: "ensure", "leverage", "utilize" spend characters without carrying the why, and "validating the input, ensuring integrity across the flow" joins two claims to one verb. Write the one claim that matters, with the plainer word.
- Sentence case, straight quotes, no decorative emoji, and no em dashes: use a comma or a period instead.

### Behaviour, not provenance

A comment records what this code does and why. It never records where the design came from: not "mirrors how project X does it", not "taken from Y", not "per section 2.3 of the spec" (unless that clause is normative for your team, see below). A decision justified only by an external project cannot be reviewed, adapted, or dropped by anyone who lacks that project, so the comment fails at its one job.

Phrase the behaviour instead: "switch is disabled while a turn is running, so in-flight events bind to the right view". Now the comment is checkable against the code.

History is not a comment either. "this used to be a regex" belongs in version control, the one record that never goes stale.

Two carve-outs, both external obligations rather than design rationale:

- **Licence and attribution headers** are a legal requirement. Never touch them.
- **A normative clause you are audited against** (a spec, a regulation, a control) is a pin, not provenance, when something outside the repo checks it. Traceability outranks the rule above in regulated work. In ordinary work it is just an external reference, and the behaviour rule applies.

### Drift

A comment that no longer matches the code is worse than no comment, because the reader trusts it. When the code under a comment changes, that comment is in scope: update it or delete it. Leaving it is the one outcome to avoid.

One describing a version of the code that no longer exists (it says cache, the code fetches) is deleted on sight rather than corrected. The reason it was written died with the code that justified it.

### Genres with their own bar

- **Doc comments on public API** (JSDoc, rustdoc, godoc) answer what a caller cannot see: side effects, thrown errors, invariants, units, the unhappy path. The redundancy test applies harder, because the signature is already right there: `@param count the number of items` restates it and goes.
- **Test comments** earn their place by naming the scenario and the non-obvious setup, not by narrating the assertion.

## The pass

Run the moves in order. The reviewer classifies; you verify and act. Never judge a verdict from the comment alone: read the code it sits on, since redundancy is a relation between the two.

1. **Spawn.** Spawn the freshest reviewer the harness offers: a subagent with no prior context on this change. Hand it the scope and **The bar** above, verbatim, and the shape of the answer: exactly one verdict per comment, **dissolve**, **rewrite**, **delete** (noise, provenance, history, or drift), or **keep**. A suppression directive is a comment too: the scope includes every scoped `eslint-disable`, `@ts-expect-error`, `biome-ignore`, and every `TODO`, and the reviewer greps for the directives the stack uses so nothing is missed. The reviewer returns verdicts only; it never edits a file. Match its effort to the scope: fast for a diff, thorough for a sweep. If the harness offers no subagent, run the pass inline and say so in the report; a degraded pass beats no pass.
2. **Verify.** Check every verdict against the code it sits on. Reject: verdicts outside the scope, keeps without proof the thing cannot change, deletes of licence or attribution headers, drift claims the code does not support, and any file the reviewer edited itself. A keep survives only with proof that the thing it annotates cannot change: a public name a spec froze, a signature callers depend on, generated or vendored code, a legal header. If a keep is refuted or still ambiguous after checking, it is a delete. The comments that survive to review are mostly the ones nobody tested. Rerun one rejected report with the failure named. Reject a second, finish the pass inline, and say so in the report.
3. **Execute.** Dissolve first: the rename or simplification is the root-cause fix, and it beats any comment. Land the smallest in-scope dissolve; if several dissolves need the same structural change, sketch that shape once before touching anything. Rewrite survivors to the why. Delete the rest, including every drifted comment and every bare suppression directive whose reason you cannot state from the code. Never add a comment as a symptom guard: if the code needs a warning, the fix is in the code.
4. **Constraint comments.** A comment that says `do not remove`, `do not change wording`, or `talk to X before changing` claims a constraint. Test the claim like any keep: a constraint on code we can change is a delete. A real constraint earns an encoding offer: the cheapest in-scope **encoding**, meaning a type, a runtime check, a test, or a CI lint that enforces the constraint mechanically, so the prose stops being the only carrier. In a live channel, wait for the answer before acting. Unattended, encode only with the caller's pre-approval. Approved: land the encoding, then delete the comment or cut it down to what the encoding cannot carry. Otherwise the comment stays, and the constraint is reported open.
5. **Report.** State the four counts (dissolved, rewritten, deleted, kept), each keep with its proof, every encoding offered and its outcome, every constraint left open, out-of-scope work worth doing, and how the pass ran: accepted on the first report, after one rerun, or inline as a fallback.

When writing new comments, the same bar runs in miniature: run the redundancy test before keeping each one, and again before finishing the change.

## Completion criterion

Every comment in scope carries a verdict from a reviewer with no stake in the code, and every verdict was checked against the code before it was executed. Every keep names its proof. Every suppression directive carries its reason inline. Every real constraint is encoded or reported open. The report states the counts and how the pass ran.
