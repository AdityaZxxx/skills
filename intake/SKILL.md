---
name: intake
description: Run the pre-build decision interview. Ask until every open decision is settled, restate the goals back for confirmation, and route each settled decision to the carrier that keeps the agent from revisiting it. Use when starting a non-trivial piece of work, when an idea or plan has open questions, when requirements feel fuzzy, or when asked to run an intake. Skip for trivial edits with no open decisions.
license: MIT
---

# Intake

Software fails in the gap between what the human meant and what the agent built. Intake closes that gap before code exists: a decision interview where the agent asks, the human answers, and every settled answer is routed to wherever it will actually be honored. Two authority rules bind the whole skill:

- **The agent never answers a question that belongs to the human.**
- **The human is never asked a question the agent can settle.** Every question arrives with a recommended default, so steering is a confirm-or-override, not an essay assignment.

## The authority test

Classify before asking anything:

**Human decides** (taste, stakes, direction): scope cuts, priorities, effort and budget trade-offs, one-way doors (deleted data, published interface breaks), naming a domain concept, how good is good enough.

**Agent decides** (execution, with full context): file layout, library choice, error wording, test placement, implementation pattern. The agent holds the opinion, states it in the spec, and the human can veto it at playback.

The test: *would a competent engineer with full context decide this the same way every time?* Yes means the agent. Any hesitation means the human.

## The gate

Run intake when at least one open decision needs a human. Skip it when the work is fully specified or trivial; interviewing for ceremony is the tax this skill exists to avoid. And never ask what memory already answers: check the repo's conventions, its decision ledger, and the installed skills first. A question the repo has already settled is noise, and noise trains the human to stop answering.

## The interview

- One decision per question, each with a default.
  - Write: "Partial refunds allowed? Default: yes, capped at the remaining refundable amount."
  - Avoid: "What are your thoughts on partial refunds?" (no default, no shape)
- Walk the tree until the leaves are settled: scope in and out, definition of done, binding constraints, and the proof plan (what will demonstrate the work is done, per **meaningful-tests**).
- Scan for blast radius early: which existing shapes does this work touch? A touched public shape pulls in **declared-breaks** before the first line of code.
- Sharpen fuzzy words on sight. "Account: the Customer or the User? Those are different things." An unresolved term in the spec becomes a bug in the build.
- Stress-test with one concrete scenario per risky decision: "The order is shipped and half refunded; the customer cancels. What happens?" No answer means that is the next decision, not a detail.
- Stop when the tree is resolved, not when the human is tired. Fewer, better questions beat an interrogation.

## Playback

Before any code: restate the goals, scope, settled decisions, definition of done, and proof plan in your own words. The human confirms or corrects. A correction reopens the branch it touches, not the whole interview. Intake is not done until playback passes; agreement you assumed is disagreement you will discover in review.

## The spec

Write the smallest artifact an executor agent could build from: goals, scope (in and out), the settled decisions with their whys, definition of done, and proof plan. One markdown file, placed by the repo's convention. The spec is a work order, not documentation: if a sentence would not change what the executor does, cut it.

## Routing decisions

A settled decision that is not routed will be revisited, and re-asking a settled question spends the trust that makes the whole loop work. Route each one inline, while it is fresh:

- **Generalizes beyond this project** → propose a skill or an AGENTS.md rule.
- **Constrains code** → structure where possible (a type, a check that fails), else a colocated rationale per **load-bearing-comments**.
- **Project-scoped policy** → one line in the project's decision ledger: date, decision, rejected alternative, why.
- **Defines proof** → a script or verification skill that reruns the check.

Retroactive memory rots. Routing at decision time is the one habit this skill enforces without exception.

## Late decisions

Decisions arriving mid-build go through the same path in miniature: classify by authority, settle with a default, route, and return to work. If a late decision changes an existing public shape, **declared-breaks** applies before anything else moves.

## Completion criterion

Every open decision is settled by the human, settled by the agent with a stated default, or explicitly deferred with an owner and a date. Playback has passed. The spec exists. Every settled decision is routed to its carrier. Only then does building begin.
