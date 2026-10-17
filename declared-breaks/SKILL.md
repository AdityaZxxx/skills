---
name: declared-breaks
description: Treat any change to an existing public shape as a declared break. Preserve compatibility, migrate callers in the same change, or flag the break with its blast radius. Use when editing a signature, field, data shape, log or event format, or configuration that existing callers depend on; when replacing a representation; or when a refactor outgrows the shape it started from.
license: MIT
---

# Declared breaks

A break to an existing shape is a legitimate engineering move. A **silent** break is a defect: code that compiled yesterday and betrays its callers today, with nothing in the record to warn them. The discipline is not avoiding breaks. It is making sure every break takes one of the three honest paths.

## The three honest paths

- **Preserve.** Keep the old shape working while the new one exists: a default parameter, the old field alongside the new, dual-writing during a transition. The default when callers are many, outside your reach, or unknown.
- **Migrate.** Update every caller and delete the old shape in the same change. Honest only when every consumer is reachable in this repo and the tests now assert the new contract. A migration that leaves one caller behind is a silent break wearing a costume.
- **Declare.** When callers exist outside your reach (another repo, an API consumer, a human reading a log), flag the break explicitly: what breaks, who it hits, and the blast radius. A one-way door (persisted data, wire formats, published interfaces) is a different statement than a two-way one. Say which.

## Reporting is not declaring

Describing a change in a summary ("the audit log now carries structured entries") records a decision. It warns no one. A declaration names the danger: "this breaks readers of the old string log; they need X." If your writeup would read exactly the same on a change with no blast radius, it declares nothing.

## The test

Before finishing a change, ask: **did this diff change what any existing caller must know?** Grep for who reads the shape, and remember that some callers cannot be grepped: persisted data is a caller, and so is a person with a saved export. If the answer is yes and the change was not preserved, migrated, or declared, the break is silent, and silent is the one outcome to avoid.
