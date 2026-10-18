---
name: verify
description: Run a full verification pass over work claimed done. Trace every requirement to its code path, audit the test suite for tests that pin wrong behaviour, build an independent script harness that exercises the requirements by observation, and audit lifecycle edges for what the requirements do not say. Use when a task or feature is claimed done, before shipping, when inheriting work from another agent, or when asked to verify or sign off.
license: MIT
---

# Verify

A done-claim is a hypothesis. Verification is the experiment. This skill structures the pass in four moves, in order, then merges everything into one deduplicated verdict. The judgment underneath is **shown-work**: nothing counts as verified because it was narrated. For a single claim mid-work, the shown-work gate is the whole procedure; this pass is for the work boundary.

## 1. Requirement trace

Walk the requirements (or the spec) item by item. For each, name the code path that satisfies it, or state plainly that none does. A requirement with no code path is a defect even if the tests pass. Verify the clean requirements too: saying which ones check out guards against false confidence.

## 2. Independent harness

Write a fresh script that exercises every requirement against the real functions by observation: boundaries, repeated operations, revoked and expired paths, and legacy data. Import the real code; never copy it. Run it and let the output decide. The harness is the deliverable a reviewer reruns, so commit it when the work will be trusted later. An implementer's passing suite is one source of evidence, never the verdict: a suite can be green while pinning the wrong spec.

## 3. Test audit

For each existing test, ask what it actually pins, and whether it could pass while the requirement it names is violated. Watch for three liars: tests whose setup makes the assertion true by construction, tests that assert the opposite of the requirements, and named requirements with no test at all. A green suite that pins wrong behaviour is worse than no suite: it launders the defect into "proven".

## 4. Lifecycle audit

Trace what the requirements do not say: boundaries, repeated operations, revoked and expired paths, legacy and persisted state, restarts, and cross-defect compounding (two minors can compose into a blocker). Where state crosses a process boundary, run real processes.

## Merge

One deduplicated defect list: requirement number (or "other"), file and symbol, severity, one line of observed evidence, and which move found it. Two or more moves finding the same defect independently is the highest signal; a single-move finding gets weighed accordingly. Then the verdict: ship or don't ship, with the blocking set named.

Completion criterion: every requirement traced to a path or flagged missing; a harness exists, runs, and its output is recorded; every test classified as pinning right or pinning wrong; the merged list deduplicated; the verdict names its blockers.
