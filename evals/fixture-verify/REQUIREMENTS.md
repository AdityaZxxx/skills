# Requirements: invites (product owner, ground truth)

1. Invites are token-based records stored in the database. No email
   delivery, ever.
2. An invite is addressed to an email even if that person has no account
   yet. On acceptance, an existing user (matched by email) joins the
   workspace; a new email creates a user from the invite.
3. Only the workspace owner can send invites, for now.
4. Members who join have the same rights as existing members; no admin
   role in this version.
5. At most 20 pending invites per workspace.
6. An invite expires 7 days after creation; expired invites are rejected
   at acceptance time and then removed.
7. The owner can revoke a pending invite.
8. Accepting twice is rejected with a clear outcome, not a crash.
9. Proof: offline assert-style tests covering accept, expiry, cap, revoke,
   and duplicate acceptance.
10. Data compatibility: database files written before invites existed
    must still load.
