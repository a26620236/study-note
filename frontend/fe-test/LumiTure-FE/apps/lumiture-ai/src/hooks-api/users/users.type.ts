export interface UsersInfos {
  userId: string;
  userName: string;
  email: string;
  role: string;
  activeStatus: boolean | string; // * API will always returns a boolean, but UI table will needs a string
  lastLogin: string | null;
  action: {
    edit?: boolean;
    remove?: boolean;
  };
}

export interface UsersActions {
  inviteAdmin?: boolean;
  inviteUser?: boolean;
  editGroup?: boolean;
  editUser?: boolean;
  removeGroup?: boolean;
  removeUser?: boolean;
  counts?: {
    resource?: number;
    tier2Group?: number;
  };
  inviteRoleOptions?: string[];
}

export interface UsersPayload {
  isAdminGroup?: boolean;
  tierOneGroupId?: string;
  tierTwoGroupId?: string;
}

export interface GroupUsers {
  users: UsersInfos[];
  groupName: string;
  orgName: string;
  groupId: string;
  availableActions: UsersActions;
  parentGroup?: {
    groupId: string;
    groupName: string;
  };
}

export interface InviteUserPayload extends UsersPayload {
  role: string;
  userEmails?: string;
}

export interface UpdateUserPayload extends UsersPayload {
  userId: string;
  role: string;
}

export enum AiQuotaServiceType {
  AiPoweredAnalyses = 'ai_powered_analyses',
  RightsizingScans = 'rightsizing_scans',
}

export interface AiQuotaItem {
  serviceType: AiQuotaServiceType;
  remaining: number;
  total: number;
}

export interface AiQuota {
  refreshDate: string;
  activePacks: number;
  quotas: AiQuotaItem[];
}
