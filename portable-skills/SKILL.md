---
name: portable-skills
description: Write skills and agent-facing documents so the function survives every model that reads them. Use when creating or editing a skill, AGENTS.md, a README, or any document an agent reaches by a pointer; when naming a skill; or when a skill misfires on a new model or harness.
license: MIT
---

# Portable skills

A skill is a contract for a job that must survive its reader. The reader is unknown and keeps changing: models differ in training data, in style, and in capability, and next year's model has not been trained on this repo. So the writing carries the **function**, stated in terms of the world, and everything that must not drift gets carried by **structure** instead. Write so the least capable model in the fleet executes correctly on the first read; the stronger ones lose nothing.

## The function, not the tic

State the job as a change in what gets done in the world, never as a correction of how a current model behaves. The test: *would this read as sensible to a perfect engineer who has never seen a model?* "Never ask what memory already answers" passes; "do not ramble" fails. A rule aimed at one model's tic dies when the tic disappears and misdirects models that never had it.

## The description is the routing contract

The description is a pointer whose wording decides when the material is reached. Pointers fire on **states of the world** ("work is claimed done", "an idea has open questions"), never on phrases a particular model tends to produce. One trigger per branch: synonyms are one branch written twice. Front-load the first word, and cut every word that does no work: the description spends its tokens on every turn of every session.

## The body assumes an unfamiliar reader

- **Define every term of art on first use.** A word like "seam" or "playback" recruits priors in a frontier model and nothing in a smaller one; one defining clause makes it work everywhere.
- **Prefer words the training data already carries.** A made-up word buys nothing; you pay in definition tokens what a common word gives free. Coin only when no existing word fits, and define on the spot.
- **Anchor meaning with a Write/Avoid pair** where an adjective would drift. Examples survive vocabulary differences; adjectives do not.
- **One meaning per word, everywhere.** Every "it" and "this" points at one obvious thing. "Only" and "not" sit next to what they change. Real symbols over synonyms. No idioms, metaphors, or slashes.
- **End in a completion criterion** that is checkable and demanding: a vague bound invites premature completion on every model, and weaker models rush it first.

## Structure carries the law

Anything that must not drift belongs outside the prose: a check script, a type, a test, a registry rule. Structure fails loudly on every model without being re-read; prose is re-interpreted by every model. When writing a rule, ask what would enforce it mechanically, and keep the prose pointing at that mechanism.

Citations between skills degrade gracefully: restate the cited principle in one clause so a model that never loaded the cited skill still functions. A citation is additive context, never a load-bearing dependency. A distributed skill never references repo-internal paths, since the reader's checkout is not this one.

## The maintenance loop

Skills stay good by re-verifying the function, not by rewriting the prose. When a new model or harness arrives, rerun the repo's evals with that model as the worker. The function either holds, or the eval shows where it broke: routing (fix the description) or execution (fix the body). Patch minimally at the break and leave the rest alone.

## Completion criterion

The document reads as sensible to an engineer who has never seen a model, triggers on states of the world, defines its own terms, carries every hard rule in structure as well as prose, and its function is covered by an eval or a check. Anything less is a misdirection scheduled to fire on the next model.
