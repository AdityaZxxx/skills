export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerUserId: string;
  memberUserIds: string[];
}

export type InviteStatus = "pending" | "accepted" | "revoked";

export interface Invite {
  id: string;
  workspaceId: string;
  email: string;
  token: string;
  status: InviteStatus;
  createdAtMs: number;
  expiresAtMs: number;
}

export interface Database {
  users: User[];
  workspaces: Workspace[];
  invites: Invite[];
}
