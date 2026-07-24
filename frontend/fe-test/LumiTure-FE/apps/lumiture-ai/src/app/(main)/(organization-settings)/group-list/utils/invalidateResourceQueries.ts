import type { QueryClient } from '@tanstack/react-query';

import { PlatformsValue } from '@constants';
import {
  awsAssignedResourcesQueryKey,
  awsAvailableResourcesQueryKey,
  azureAssignedResourcesQueryKey,
  azureAvailableResourcesQueryKey,
  gcpAssignedResourcesQueryKey,
  gcpAvailableResourcesQueryKey,
  tierOneGroupsQueryKey,
  tierOneUsersQueryKey,
  tierTwoGroupsQueryKey,
  tierTwoUsersQueryKey,
} from '@hooks-api';

interface InvalidateResourceQueriesParams {
  queryClient: QueryClient;
  platform: PlatformsValue;
  groupId: string;
  tierOneGroupId: string;
  tierTwoGroupId?: string;
}

export const invalidateResourceQueries = ({
  queryClient,
  platform,
  groupId,
  tierOneGroupId,
  tierTwoGroupId,
}: InvalidateResourceQueriesParams) => {
  switch (platform) {
    case PlatformsValue.AWS:
      queryClient.invalidateQueries({ queryKey: awsAssignedResourcesQueryKey(groupId) });
      queryClient.invalidateQueries({ queryKey: awsAvailableResourcesQueryKey(groupId) });
      break;
    case PlatformsValue.AZURE:
      queryClient.invalidateQueries({ queryKey: azureAssignedResourcesQueryKey(groupId) });
      queryClient.invalidateQueries({ queryKey: azureAvailableResourcesQueryKey(groupId) });
      break;
    case PlatformsValue.GCP:
      queryClient.invalidateQueries({ queryKey: gcpAssignedResourcesQueryKey(groupId) });
      queryClient.invalidateQueries({ queryKey: gcpAvailableResourcesQueryKey(groupId) });
      break;
  }

  queryClient.invalidateQueries({ queryKey: tierOneGroupsQueryKey });
  queryClient.invalidateQueries({ queryKey: tierTwoGroupsQueryKey(tierOneGroupId) });

  queryClient.invalidateQueries({ queryKey: tierOneUsersQueryKey(tierOneGroupId) });
  queryClient.invalidateQueries({ queryKey: tierTwoUsersQueryKey(tierOneGroupId, tierTwoGroupId) });
};
