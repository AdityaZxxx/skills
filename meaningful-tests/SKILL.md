---
name: meaningful-tests
description: Write tests that pin product behaviour rather than restating the implementation or chasing coverage targets. Use when composing, extending, or revising any test (unit, integration, e2e); when about to write a test for a given feature; when cleaning up or de-slopping test prose (names, describe blocks, assertion messages); or when asked for more coverage, a test for this, or to make a failing suite pass.
license: MIT
---

# Meaningful tests

Tests pin **behaviour**, not implementation. A suite is a contract that keeps the product's outward behaviour stable; it is not coverage to be filled and not a transcription of what the code already does.

## Pin behaviour, not output

A test states the intended behaviour, then asserts it. The assertion names the outcome a user can observe, so the test survives a refactor that changes nothing the user sees.

- Write: "Given an empty cart, checking out yields a confirmation and zero orders."
- Avoid: "Given the current `checkout()` implementation, it returns this object."

The second form is the one failure this skill guards against: a **mirror test** that restates whatever the implementation happens to return. It passes by construction and pins nothing, because the code is the only source of the expected value. The expected value must come from an independent source: a known-good literal, a worked example, the spec.

## The name is part of the pin

The assertion pins the behaviour; the name is what a failure shows first. Write the name as the behaviour in one sentence, so a failing test opens with what broke:

- Write: "checkout with an empty cart yields a confirmation and zero orders."
- Avoid: "test checkout", "works correctly", "successfully handles the request."

A name like "works correctly" could sit unchanged on any passing test in any repo, so it pins nothing. "Successfully" and "properly" are hedges in an outcome's place: cut them and state what happens. The same bar covers the rest of the suite's prose. Describe blocks and assertion messages use plain words, without filler ("in order to verify" is "verify") or narration ("this test verifies that" restates the harness; start with the behaviour).

## The gate

Write a test only to lock an **intentional behaviour worth keeping stable**: a hand-written contract, an invariant, a regression that cost real time. Skip a test whose correctness is already guaranteed elsewhere (the platform, framework, compiler, or build system), or one that would be a mirror test:

- A static asset responds 200.
- An imported image exists at a known path.
- A constant equals the literal it was defined with.
- A wrapper calls another function once, *unless that call is itself a contract to pin* (a side effect, a retry, a dedupe).

The presence of `noise-light.png` is not meaningful product behaviour; a `GET /noise-light.png → 200` test is a mirror test.

Before you write a test, run the gate: **does it pin behaviour a user can observe or a regression worth preventing?** If not, don't write it.

## When a test already exists

An existing test is part of the project's contract. When you modify the behaviour it covers:

- Run the relevant tests first.
- Keep their intent.
- Update them when the intended behaviour deliberately changes.
- Never alter or delete a test to make a failing implementation pass.

A failing test means one of two things: the implementation is wrong, or the intended behaviour has changed. Investigate which before changing either.

## When asked for tests

Follow the requested scope. When tests are asked for after a feature is done, read the finished implementation and pin its intended behaviour rather than mechanically covering every function or branch. If the scope is unclear, ask before building a large test surface.