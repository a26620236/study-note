import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  getRightsizingAvailableResourcesQueryKey,
  getRightsizingSettingsQueryKey,
  rightsizingAvailableResourcesQueryFn,
  rightsizingSettingsQueryFn,
} from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { RightsizingSettings } from './RightsizingSettings';

interface RightsizingSettingsHydrationProps {
  scopeId?: string;
}

export async function RightsizingSettingsHydration({
  scopeId: paramScopeId,
}: RightsizingSettingsHydrationProps) {
  const queryClient = new QueryClient();
  const headers = await getServerAuthHeaders();

  const settingsData = await queryClient.fetchQuery({
    queryKey: getRightsizingSettingsQueryKey(paramScopeId),
    queryFn: async () => await rightsizingSettingsQueryFn(headers, paramScopeId),
  });

  const assignedGroupIds = settingsData.data.groups
    .filter((group) => group.assigned)
    .map((group) => group.groupId);

  const scopeId = paramScopeId ?? settingsData.data.scopes[0]?.scopeId;

  await queryClient.prefetchQuery({
    queryKey: getRightsizingAvailableResourcesQueryKey(scopeId, assignedGroupIds),
    queryFn: async () =>
      await rightsizingAvailableResourcesQueryFn({ groupIds: assignedGroupIds, scopeId }, headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RightsizingSettings />
    </HydrationBoundary>
  );
}
