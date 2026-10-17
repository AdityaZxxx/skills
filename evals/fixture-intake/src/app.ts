import { Database, User, Workspace } from "./types";

let nextId = 100;

export function newId(prefix: string): string {
  nextId += 1;
  return `${prefix}_${nextId}`;
}

export function createUser(db: Database, name: string, email: string): User {
  const user: User = { id: newId("usr"), name, email };
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
