import type * as z from 'zod';

import type { EditGroupSchema } from '@components/dialog/form-schema';

export type EditGroupPayload = z.infer<typeof EditGroupSchema>;
export interface GroupsActions {
  createGroup: boolean;
  editGroup: boolean;
}
export interface TierOneGroupsInfos {
  id: number;
  groupName: string;
  creator: string;
  timeCreated: string;
  lastUpdated: string;
  resource?: number;
  tier2Group?: number;
  action?: {
    edit?: boolean;
    remove?: boolean;
  };
  isOptimizeUpdate?: boolean;
}
export interface GetTierOneGroupsResponse {
  groups: TierOneGroupsInfos[];
  availableActions: GroupsActions;
}

export interface TierTwoGroupsInfos {
  id: number;
  groupName: string;
  creator: string;
  timeCreated: string;
  lastUpdated: string;
  resource?: number;
  action?: {
    edit?: boolean;
    remove?: boolean;
  };
  isOptimizeUpdate?: boolean;
}

export interface GetTierTwoGroupsResponse {
  groups: TierTwoGroupsInfos[];
  availableActions: GroupsActions;
}

export interface TierOneGroupPayload {
  tierOneGroupId: number;
}

export interface TierTwoGroupPayload {
  tierOneGroupId: number;
  tierTwoGroupId: number;
}
