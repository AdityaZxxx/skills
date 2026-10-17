---
name: deep-modules
description: Design deep modules when writing or restructuring code: a small interface hiding a large amount of behaviour, at a seam chosen on purpose. Use when creating a module, shaping or extracting an interface, deciding where a seam goes, wrapping a dependency, making code testable, or when asked to architect, design, or structure code.
license: MIT
---

# Deep modules

A module exists to hide complexity. The good ones hide a lot of it behind very little: a small interface the caller must learn, a large implementation the caller never sees. The bad ones are **shallow**: an interface nearly as complex as the body, a wrapper that adds a hop without removing a fact. Depth is the measure of the difference, and it is the whole aim of this skill.

Write for the maintainer who sees one file at a time, copies the nearest example, and takes the shortest path that compiles. That maintainer exists (it is often an agent now), and every shallow module grows a crop of copies of itself.

## Vocabulary

Use these terms exactly, in code, comments, and prose: drifting to "component", "service", "API", or "boundary" blurs the one distinction that matters.

- **Module**: anything with an interface and an implementation: a function, a class, a package, a tier-spanning slice. Deliberately scale-agnostic.
- **Interface**: everything a caller must know to use the module right: the signature plus invariants, ordering, error modes, and performance behaviour. Not just the type-level surface.
- **Seam**: the place where behaviour could vary without edits in that spot: the location an interface lives. Choosing the seam is its own decision, separate from what goes behind it.
- **Adapter**: a concrete thing that satisfies an interface at a seam. It names a role, not a substance.
- **Depth**: behaviour per unit of interface. Deep is a lot behind a little; shallow is the reverse.
- **Leverage**: what callers get from depth: capability per fact learned, paid once across every call site and test.
- **Locality**: what maintainers get from depth: change, bugs, and verification concentrate in one place. Fix once, fixed everywhere.

## The tests

**The deletion test.** Imagine deleting the module outright. If complexity vanishes with it, the module was a pass-through and never earned its seam. If the same complexity reappears in N callers, the module was concentrating it, which is the job. Apply this to every wrapper you are about to add and every wrapper you meet.

**The interface is the test surface.** Callers and tests cross the same seam. A test that must reach past the interface (mocking internals, poking private state) is evidence the module is the wrong shape, not evidence the test needs another mock.

**One adapter is a hypothetical seam. Two are real.** A seam costs every reader a jump to answer "where does this actually happen?". Don't introduce one until something genuinely varies across it. The second adapter is the moment the seam starts paying rent.

**Depth is a property of the interface.** A deep module may contain many small parts internally, with seams private to its implementation and its own tests. What matters is what the outside must know, and that should stay small.

## Shape

1. **Accept dependencies, don't construct them.**

   ```typescript
   // The seam is visible and swappable
   function processOrder(order, paymentGateway) {}

   // The seam is welded shut
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results, don't produce side effects.**

   ```typescript
   // The caller learns one fact and owns the outcome
   function calculateDiscount(cart): Discount {}

   // The mutation is a fact the interface never mentioned
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Shrink the surface before growing the body.** Fewer methods, simpler parameters, more hidden. A rich interface can still be deep when it concentrates capability; scattering that capability across ten thin layers is how shallow is made.

## The gate

Run it before introducing any wrapper, layer, interface, or indirection, and again on the one you were about to copy:

**Does this hide more complexity than its interface adds?**

A wrapper whose interface is as complex as its body fails, no matter how fashionable the pattern. So does a layer that only forwards. When the current shape is clear, local, and unlikely to grow, prefer boring code: the discipline is knowing which seams earn their keep, not adding seams everywhere.

Where the shape is already clear, encode the domain in types rather than conditionals: a state machine over boolean soup, a discriminated union over stringly-typed branches, a lookup table over a switch repeated across files. The test is the same: does the structure delete branches, duplicated rules, and impossible states? If it only adds indirection, it fails.

## Design it twice

For an interface that will outlive this change, sketch two structurally different shapes before committing: one minimal (one to three entry points, maximum leverage each), one flexible (many use cases, extension built in). Pick with stated reasons, and say where the two would combine. The first idea is a starting position, not a design.

## When you touch code

A shallow module in the code you are already editing is in scope: apply the deletion test, and deepen or delete it while you are there. Changing an existing interface's shape is a bigger decision than adding one: preserve it, migrate its callers in the same change, or declare the break, per the **declared-breaks** discipline. Leave a repository-wide architecture sweep to its own pass: folded into a feature change it makes the diff unreadable and buries the behaviour change.

## Applying the bar

**Designing:** write the caller's usage first, derive the interface from it, and check the result against the deletion test before writing the body.

**Reviewing:** for each new or changed interface in the diff, name what it hides and count what a caller must know. Flag wrappers that fail the gate, tests that reach past the interface, seams with a single adapter, and existing shapes the diff changed without declaring the break.

Completion criterion: every interface in the diff hides more than it shows, is testable through the interface alone, and either has two adapters or a named reason why none exists yet.
