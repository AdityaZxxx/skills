---
name: shown-work
description: Treat done as a claim about reality and prove it against the real artifact before declaring it. Use when finishing any task or feature, before reporting success, when reviewing a claim that something works, or when a subagent or tool reports completion. Skip for throwaway exploration where nothing will be trusted.
license: MIT
---

# Proven done

"Done" is a claim about reality, and reality does not accept self-reports. A task is done when the real artifact has been observed doing the real thing: the feature run, the actual value read back from the store, the file the change was supposed to write opened and looked at. "It compiles", "tests pass", and "should work" are proxies, and proxies are where silent breaks live.

## The proof, not the assurance

- **Observe the real thing directly.** Run the feature on the real path; read the value out of the persisted store, not out of a variable; provoke the unhappy path on purpose (expired, revoked, duplicate, empty, legacy).
- **Script the check when you can.** A rerunnable proof script turns "trust me" into "run this". The script is the artifact a reviewer executes instead of believing you; keep its output with the claim, and commit it when the work will be trusted later.
- **When a check fails, suspect the observation before the system.** Half of false alarms are a measurement bug, and chasing the system first hides the real fault.

## The gate

Before declaring done, enumerate the claims "done" makes, and name the proof that pins each one. A claim with no proof is not done; it is a hope with a deadline. Proxies that fail the gate:

- A count standing in for coverage ("15 checks green" says nothing about which behaviours the checks pin).
- A self-report, from a subagent, a tool, or your own earlier pass: implementers and reviewers alike misreport, so re-verify the claim against the artifact.
- Evidence from a stale run: a log, a screenshot, or a result from before the last change.
- "It should work" for anything on the unhappy path.

## What counts as a proof

- The behaviour observed through the public interface, on the real path.
- The unhappy path provoked deliberately, with the actual error or outcome recorded.
- A rerunnable script whose output can be diffed by anyone with the repo.

## Scale

One claim, one proof: for a single assertion mid-work ("the migration runs", "the export includes every row"), this gate is the whole procedure. A whole piece of work at its boundary, handed over or inherited, is the **verify** pass; do not run four moves on a one-line fix, and do not ship a feature on one proof.

## Completion criterion

Every claim in "done" names its proof, and every proof has been run against the artifact rather than narrated. Zero claims rest on self-report.
