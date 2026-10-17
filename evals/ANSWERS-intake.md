# Product owner answer script (pre-registered)

The human in the intake eval answers only from this script. Any question
the script does not cover gets the answer: "Use your default." Nothing
here is negotiated mid-run.

1. Delivery: token-based invites stored in the database. No email, ever.
2. Who can invite: the workspace owner only, for now.
3. Roles: members who join have the same rights as existing members. No
   admin role in this version.
4. Cap: at most 20 pending invites per workspace.
5. Expiry: an invite expires 7 days after creation; expired invites are
   rejected at acceptance, then removed.
6. Accepting: an existing user (matched by email) joins the workspace; a
   new email creates a user from the invite.
7. Revocation: the owner can revoke a pending invite.
8. Duplicate acceptance: rejected with a clear outcome, not a crash.
9. Proof: offline assert-style tests covering accept, expiry, cap,
   revoke, and duplicate acceptance.
