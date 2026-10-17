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

export interface Database {
  users: User[];
  workspaces: Workspace[];
}
