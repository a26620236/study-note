export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Member = 'member',
}

export interface Group {
  groupId: string;
  groupName: string;
  role: Role;
}

export interface GetUserGroupsResponse {
  groups: Group[];
  defaultGroupId: string;
}
