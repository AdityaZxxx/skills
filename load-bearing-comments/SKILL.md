---
name: load-bearing-comments
description: A comment earns its place only when it carries a why the code cannot state. Use when writing, keeping, or editing any comment (inline, doc comment, TODO, suppression directive, magic-number note); when deciding whether a line needs one; when reviewing or cleaning up existing comments; or when asked why a comment is there, or to strip comment slop.
license: MIT
---

# Load-bearing comments

A comment is a fallback, not a feature. Code is self-explaining by construction: effective naming, simple expressions, idiomatic syntax. A comment earns its place only when it is **load-bearing**, carrying a reason the code cannot state on its own.

The repo's own documented convention wins where the two conflict. This is the floor, not the override.

## The redundancy test

Ask: _if I rewrote the code (better name, simpler expression, clearer structure), would this comment become redundant?_

If yes, rewrite the code and delete the comment. Renaming usually dissolves a comment, which is the cheapest fix available and leaves the file better than it found it.

Sometimes the code is fixed: a public name a spec froze, a signature callers depend on, generated or vendored code. Then the comment stays, and earns its place by carrying the why instead of the mechanism. Replacing what a comment says is far cheaper than changing code that cannot change, so this is a rewrite, not an exemption.

Redundant is not the only failure. A comment can be non-redundant and still be noise: narrating the code's own structure or progress ("now handle the empty case", "see above"), throat-clearing ("this function is responsible for..."), pointing at the line above. A surviving comment must also carry a **why**:

- a **trade** the code cannot show: a deliberate choice, and the cost it accepts
- a **pin**: an external constraint or upstream bug, marked with the version it applies to
- an **intent**: a rule the code obeys but never states, and that a future change could break

No why, no comment.

## What may survive

- **A trade**: "no caching here, invalidation is the hard part." The trade, not the mechanism.
- **A pin**: `pinned to libfoo 2.3.1: upstream deadlock on close, issue 411`. Name the version, so the comment can be retired on a schedule instead of living forever.
- **A deliberate omission**: what you chose not to do, and what would change your mind. The clearest kind of comment, because code cannot show an absence.
- **A non-obvious constant or unit**: the number alone says nothing; the reason it is that number carries the intent.
- **A suppression reason**: every `eslint-disable`, `@ts-expect-error`, `biome-ignore` carries its reason inline. A bare directive is a defect: the next reader cannot tell whether it still applies.
- **A TODO with a real ticket**: an owner and a number. A TODO with neither is a mood, and moods rot.

## Shape

Surviving is not licence to ramble.

- One line, two at the outside.
- The reason, not the mechanism. The code already states what happens.
- Say the specific thing. "30s to match the backup SLA" beats "short timeout".

## Behaviour, not provenance

A comment records what this code does and why. It never records where the design came from: not "mirrors how project X does it", not "taken from Y", not "per section 2.3 of the spec" (unless that clause is normative for your team, see below). A decision justified only by an external project cannot be reviewed, adapted, or dropped by anyone who lacks that project, so the comment fails at its one job.

Phrase the behaviour instead: "switch is disabled while a turn is running, so in-flight events bind to the right view". Now the comment is checkable against the code.

History is not a comment either. "this used to be a regex" belongs in version control, the one record that never goes stale.

Two carve-outs, both external obligations rather than design rationale:

- **Licence and attribution headers** are a legal requirement. Never touch them.
- **A normative clause you are audited against** (a spec, a regulation, a control) is a pin, not provenance, when something outside the repo checks it. Traceability outranks the rule above in regulated work. In ordinary work it is just an external reference, and the behaviour rule applies.

## Drift

A comment that no longer matches the code is worse than no comment, because the reader trusts it. When the code under a comment changes, that comment is in scope: update it or delete it. Leaving it is the one outcome to avoid.

One describing a version of the code that no longer exists (it says cache, the code fetches) is deleted on sight rather than corrected. The reason it was written died with the code that justified it.

## Genres with their own bar

- **Doc comments on public API** (JSDoc, rustdoc, godoc) answer what a caller cannot see: side effects, thrown errors, invariants, units, the unhappy path. The redundancy test applies harder, because the signature is already right there: `@param count the number of items` restates it and goes.
- **Test comments** earn their place by naming the scenario and the non-obvious setup, not by narrating the assertion.

## When you touch code

A comment in the code you are editing is in scope. Delete the ones that fail the test while you are there, and rewrite the code where that is what it takes. Leave a repository-wide sweep to its own pass: folded into a feature change it makes the diff unreadable and buries the behaviour change.

## Applying the bar

**Writing:** run the redundancy test before keeping each comment, and again before finishing the change. The comments that survive to review are mostly the ones nobody tested.

**Reviewing:** enumerate every comment in the diff, classify each as keep, update, or delete, then act on that verdict. Do not classify from the comment alone: read the code it sits on, since redundancy is a relation between the two.

Completion criterion: every comment in the diff either carries a why, or is gone.
