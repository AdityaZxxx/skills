# Evals

Behavioural A/B tests for the skills in this repo. A skill change is not done until an eval shows the behaviour it claims, or honestly shows that it does not. This is deliberately one file: when it stops matching how evals are actually run here, rewrite it or delete it. Stale process docs are worse than none.

## The fixture

`fixture/` is a frozen TypeScript orders system planted with four smells the skills target: a shallow pass-through wrapper (`src/utils/money.ts`), a welded dependency (`OrderService` constructs its own `StripeGateway`), validation scattered through business logic, and status boolean soup. `fixture/TASK.md` asks for refund support with offline-testable rules, a second provider next quarter, and auditable attempts: constraints that quietly reward deep design without naming any skill's vocabulary.

`fixture-intake/` is the second fixture: a fuzzy feature task (invites) whose open decisions are deliberately unspecified, for testing pre-build skills. Its product owner answer script lives in `ANSWERS-intake.md` (harness material, never copied into run dirs: the human answers via session continuation, and uncovered questions get "use your default").

Freeze means freeze: add new fixtures alongside, never edit one in place.

## Running an eval

1. Copy the fixture to a fresh run directory per arm; `git init` and commit the baseline.
2. Give a fresh sub-agent the base prompt below. Arms differ only in the skill block injected after it, framed as "your skill library; they apply to this work; follow them."
3. Copy finished runs to `anonymous/A` and `anonymous/B` by coin flip; keep the mapping away from the judge.
4. A fresh judge sub-agent reads the fixture, A, and B, and scores 1 to 5 on: shallow wrappers, seam placement, refund interface quality, domain state modelling, testability, restraint and fit. It also verifies every TASK.md requirement and censuses the new or changed interfaces. Judge artifacts only; no speculation about process.
5. The orchestrator verifies the judge's load-bearing factual claims against the trees before accepting scores. Not optional: round 1's judge falsely claimed neither engineer had removed a wrapper that one had deleted.

Base prompt, identical for every arm:

> You are a senior engineer picking up a small codebase.
> Working directory: \<run dir\>. Do all of your work inside that directory. Read README.md and TASK.md there, then implement the task described in TASK.md.
> Notes: TypeScript, no frameworks, no package.json, no build step. Prioritise clear types over tooling. If you add tests, plain assert-style files are fine (no test runner required to exist). Do not install anything and do not make network calls.
> When you finish, reply with: (1) every file you added, edited, or deleted; (2) a short summary of the structural decisions you made and why; (3) anything you considered and rejected.

## The silent-change criterion

Classify every change to an existing public shape: **preserved** (old shape still works), **migrated** (every reachable caller updated in the same change, tests assert the new contract), **declared** (the break is flagged with what breaks, who it hits, and the blast radius; describing a change is not declaring it), or **silent** (none of these: the one outcome declared-breaks exists to prevent).

## Standing findings (rounds 1 and 2)

- **Invocation surface beats library membership.** pstack's anti-silence principles sat in the injected library and never fired (citation-only, scope-gated); Matt's one declaration came from reporting culture, not from a gate that checks compatibility. Model-invoked discipline skills with trigger descriptions run on every code-touching task without being summoned.
- **Deepening and compatibility trade off.** The deepest result broke most, the most compatible deepened least. A stack needs both disciplines reachable at once.
- **Verify judge claims against the artifacts.** One factual error caught and corrected in round 1 alone.
- **Intake changed the behaviour it targets (intake round).** With the skill, the agent stopped before building, asked three decision-shaped questions with defaults and concrete scenarios, honoured both overrides of its own defaults, and routed decisions to SPEC, a decision ledger, named constants, a type-enforced status, and rerunnable tests. The blind judge, checking both trees against the owner's requirement notes, scored 9/9 coverage for the intake arm against 4 full plus 3 partial or missing for the control, which guessed member-wide invites, no expiry, and no cap, and added an unrequested decline flow.
- **Found gap in intake: playback did not bind in async flows.** Both intake runs compressed playback into "vetoable at review" instead of waiting for confirmation. Patched in the skill: the playback section now states its interaction contract explicitly (async means the restatement ends the turn and the confirmation arrives as the next message).
- **Harness lessons for evals.** Interview-following agents in background subagents get cancelled when they try to prompt interactively, so the eval contract is "write the questions in your reply and stop." Answer scripts are harness material, never shipped inside run dirs: a leaked script turned a round into a twin test of "the repo ships its decisions", which both arms honoured without re-asking.

One trial per arm is directional, not statistical. Injected skill subsets approximate a harness; expect real-world effect sizes smaller than eval effect sizes. Round narratives belong in git history, not here.
