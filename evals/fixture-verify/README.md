# Teamboard

A tiny workspace app: users join workspaces, workspaces hold their member
list, and owners invite teammates by email token. Storage is a single JSON
file. No dependencies; plain node runs it, including the tests:

    node src/invites.test.ts
