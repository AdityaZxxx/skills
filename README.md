A skill that completely eliminates the slop and forces the AI to produce high-quality output.

## What's here

- **meaningful-tests**: writes tests that pin real behaviour instead of chasing coverage or echoing the implementation back at you. Skips mirror tests that pass by construction.
- **load-bearing-comments**: writes comments that carry a why the code cannot state, and deletes the ones that only restate it. Runs a redundancy test that prefers renaming the code over annotating it.
- **deep-modules**: shapes code into deep modules: a small interface hiding a large amount of behaviour, at a seam that earns its keep. Applies the deletion test to wrappers and kills shallow layers before they spawn copies.
- **declared-breaks**: makes every change to an existing public shape honest: preserve it, migrate its callers in the same change, or declare the break with its blast radius. Reporting a change is not declaring a break.
- **intake**: runs the pre-build decision interview: the agent asks with a default attached, the human settles what only they can, playback confirms the goals, and every settled decision is routed so the agent never re-asks it.
- **shown-work**: treats done as a claim about reality: observe the real artifact, script the check so it reruns, and let no claim rest on a self-report. The gate enumerates every claim in done and names its proof.
- **verify**: the four-move verification pass: trace every requirement, build an independent script harness, audit the tests for what they really pin, and audit lifecycle edges, then merge into one deduplicated ship verdict.
- **portable-skills**: the writing standard for skills and agent-facing documents: function stated about the world, routing on observable situations, vocabulary defined in-file, hard rules carried by structure, and evals to re-verify the function when models change.

## Installation

```bash
npx skills add AdityaZxxx/skills
```
