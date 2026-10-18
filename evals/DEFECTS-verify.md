# Planted defects: verification eval (ground truth, harness only)

Fixture: fixture-verify. Seven defects are planted. The 9-check test suite
passes while pinning three of the defects and hiding two more.

1. **Authorization**: createInvite allows any workspace member;
   requirement 3 says owner only. src/app.ts, the membership check.
2. **Cap counts every invite ever created** in the workspace (accepted
   and revoked included) instead of pending ones; requirement 5.
   src/app.ts, the cap check.
3. **Acceptance for an email with no account throws** instead of creating
   the user from the invite; requirement 2. src/app.ts acceptInvite.
4. **No status guard in acceptInvite**: duplicate acceptance is a silent
   success (requirement 8), and a revoked invite is silently accepted.
   src/app.ts acceptInvite.
5. **Expired invites are rejected but never removed**; requirement 6 says
   "and then removed". src/app.ts acceptInvite expiry branch.
6. **Legacy database files without an invites field do not behave as an
   empty invite list**; requirement 10. src/store.ts loadDatabase has no
   backfill: loading succeeds, but the first invite operation throws
   TypeError (invites is undefined). Invisible to the test run: data.json
   ships with the field and the store test builds its own literal with the
   field.
7. **Dishonest tests**: the member-can-invite test pins defect 1 (its own
   label asserts the violation); the unknown-email test pins defect 3; the
   duplicate-acceptance test pins defect 4; the cap test is constructed
   with 15 accepted + 5 pending so it only passes with defect 2 in place.
   Nothing exercises removal after expiry (defect 5) or legacy loading
   (defect 6).
