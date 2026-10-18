import assert from "node:assert";
import os from "node:os";
import type { Database } from "./types.ts";
import { createInvite, acceptInvite, revokeInvite, createUser, createWorkspace } from "./app.ts";
import { loadDatabase, saveDatabase } from "./store.ts";

const DAY = 24 * 60 * 60 * 1000;
const t = 1_700_000_000_000;

function freshDb(): Database {
  return {
    users: [{ id: "usr_1", name: "Ada", email: "ada@example.com" }],
    workspaces: [{ id: "ws_1", name: "Launch", ownerUserId: "usr_1", memberUserIds: ["usr_1"] }],
    invites: [],
  };
}

const checks: [string, () => void][] = [
  ["owner creates an invite", () => {
    const db = freshDb();
    const invite = createInvite(db, "ws_1", "usr_1", "New@example.com", t);
    assert.equal(invite.email, "new@example.com");
    assert.equal(invite.status, "pending");
  }],
  ["a member who is not the owner can invite teammates", () => {
    const db = freshDb();
    db.users.push({ id: "usr_2", name: "Grace", email: "grace@example.com" });
    db.workspaces[0].memberUserIds.push("usr_2");
    const invite = createInvite(db, "ws_1", "usr_2", "someone@example.com", t);
    assert.equal(invite.status, "pending");
  }],
  ["an existing user accepts and joins", () => {
    const db = freshDb();
    db.users.push({ id: "usr_3", name: "Lin", email: "lin@example.com" });
    const invite = createInvite(db, "ws_1", "usr_1", "lin@example.com", t);
    const user = acceptInvite(db, invite.token, t + DAY);
    assert.equal(user.id, "usr_3");
    assert.ok(db.workspaces[0].memberUserIds.includes("usr_3"));
    assert.equal(invite.status, "accepted");
  }],
  ["an email with no account cannot accept", () => {
    const db = freshDb();
    const invite = createInvite(db, "ws_1", "usr_1", "stranger@example.com", t);
    assert.throws(() => acceptInvite(db, invite.token, t + DAY), /no user with that email/);
  }],
  ["accepting twice does not throw or duplicate", () => {
    const db = freshDb();
    db.users.push({ id: "usr_3", name: "Lin", email: "lin@example.com" });
    const invite = createInvite(db, "ws_1", "usr_1", "lin@example.com", t);
    acceptInvite(db, invite.token, t + DAY);
    const again = acceptInvite(db, invite.token, t + DAY);
    assert.equal(again.id, "usr_3");
    assert.equal(db.workspaces[0].memberUserIds.filter((id) => id === "usr_3").length, 1);
  }],
  ["an expired invite is rejected", () => {
    const db = freshDb();
    const invite = createInvite(db, "ws_1", "usr_1", "late@example.com", t);
    assert.throws(() => acceptInvite(db, invite.token, t + 8 * DAY), /invite expired/);
  }],
  ["the owner revokes a pending invite", () => {
    const db = freshDb();
    const invite = createInvite(db, "ws_1", "usr_1", "rev@example.com", t);
    revokeInvite(db, invite.id, "usr_1");
    assert.equal(invite.status, "revoked");
    assert.throws(() => revokeInvite(db, invite.id, "usr_9"), /only the owner/);
  }],
  ["cap: the 21st invite is rejected", () => {
    const db = freshDb();
    for (let n = 0; n < 15; n++) db.users.push({ id: `usr_x${n}`, name: `X${n}`, email: `x${n}@example.com` });
    for (let n = 0; n < 15; n++) {
      const inv = createInvite(db, "ws_1", "usr_1", `x${n}@example.com`, t);
      acceptInvite(db, inv.token, t + DAY);
    }
    for (let n = 0; n < 5; n++) createInvite(db, "ws_1", "usr_1", `p${n}@example.com`, t + DAY);
    assert.throws(() => createInvite(db, "ws_1", "usr_1", "p20@example.com", t + DAY), /invite cap reached/);
  }],
  ["store round-trips a database", () => {
    const db = freshDb();
    const p = `${os.tmpdir()}/teamboard-verify-${process.pid}.json`;
    saveDatabase(db, p);
    const loaded = loadDatabase(p);
    assert.equal(loaded.users.length, 1);
    assert.equal(loaded.invites.length, 0);
  }],
];

let failures = 0;
for (const [name, fn] of checks) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (e) {
    failures += 1;
    console.log(`FAIL - ${name}: ${(e as Error).message}`);
  }
}
if (failures > 0) {
  console.log(`${failures} check(s) failing`);
  process.exit(1);
}
console.log(`${checks.length} checks pass`);
