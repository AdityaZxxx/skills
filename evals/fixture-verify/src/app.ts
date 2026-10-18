import type { Database, Invite, User, Workspace } from "./types.ts";

let nextId = 100;

export function newId(prefix: string): string {
  nextId += 1;
  return `${prefix}_${nextId}`;
}

const MAX_PENDING_INVITES = 20;
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createUser(db: Database, name: string, email: string): User {
  const user: User = { id: newId("usr"), name, email: email.trim().toLowerCase() };
  db.users.push(user);
  return user;
}

export function createWorkspace(db: Database, name: string, ownerUserId: string): Workspace {
  const ws: Workspace = { id: newId("ws"), name, ownerUserId, memberUserIds: [ownerUserId] };
  db.workspaces.push(ws);
  return ws;
}

export function workspacesFor(db: Database, userId: string): Workspace[] {
  return db.workspaces.filter((ws) => ws.memberUserIds.includes(userId));
}

export function renameWorkspace(db: Database, workspaceId: string, name: string): void {
  const ws = db.workspaces.find((w) => w.id === workspaceId);
  if (!ws) throw new Error("workspace not found");
  ws.name = name;
}

export function createInvite(db: Database, workspaceId: string, inviterUserId: string, email: string, nowMs: number): Invite {
  const ws = db.workspaces.find((w) => w.id === workspaceId);
  if (!ws) throw new Error("workspace not found");
  if (!ws.memberUserIds.includes(inviterUserId)) throw new Error("only members can invite");
  const normalized = email.trim().toLowerCase();
  if (db.invites.filter((i) => i.workspaceId === workspaceId).length >= MAX_PENDING_INVITES) {
    throw new Error("invite cap reached");
  }
  const invite: Invite = {
    id: newId("inv"),
    workspaceId,
    email: normalized,
    token: newId("tok"),
    status: "pending",
    createdAtMs: nowMs,
    expiresAtMs: nowMs + INVITE_TTL_MS,
  };
  db.invites.push(invite);
  return invite;
}

export function acceptInvite(db: Database, token: string, nowMs: number): User {
  const invite = db.invites.find((i) => i.token === token);
  if (!invite) throw new Error("invite not found");
  if (nowMs >= invite.expiresAtMs) throw new Error("invite expired");
  const user = db.users.find((u) => u.email === invite.email);
  if (!user) throw new Error("no user with that email");
  const ws = db.workspaces.find((w) => w.id === invite.workspaceId);
  if (!ws) throw new Error("workspace not found");
  if (!ws.memberUserIds.includes(user.id)) ws.memberUserIds.push(user.id);
  invite.status = "accepted";
  return user;
}

export function revokeInvite(db: Database, inviteId: string, actorUserId: string): void {
  const invite = db.invites.find((i) => i.id === inviteId);
  if (!invite) throw new Error("invite not found");
  const ws = db.workspaces.find((w) => w.id === invite.workspaceId);
  if (!ws) throw new Error("workspace not found");
  if (ws.ownerUserId !== actorUserId) throw new Error("only the owner can revoke");
  if (invite.status !== "pending") throw new Error("invite is not pending");
  invite.status = "revoked";
}
