import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  childGroupBudgetQueryFn,
  childGroupBudgetQueryKey,
  currentGroupBudgetQueryFn,
  currentGroupBudgetQueryKey,
  generalAlertsQueryFn,
  generalAlertsQueryKey,
  Segment,
  type BudgetPlatformValue,
} from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { BudgetSettings } from './BudgetSettings';

interface BudgetSettingsHydrationProps {
  platform: BudgetPlatformValue;
}

export const BudgetSettingsHydration = async ({ platform }: BudgetSettingsHydrationProps) => {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  const currentGroupParams = { segment: Segment.MONTHLY };
  const childGroupParams = { platform, segment: Segment.MONTHLY };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: currentGroupBudgetQueryKey(currentGroupParams),
      queryFn: async () => await currentGroupBudgetQueryFn(currentGroupParams, headers),
    }),
    queryClient.prefetchQuery({
      queryKey: childGroupBudgetQueryKey(childGroupParams),
      queryFn: async () => await childGroupBudgetQueryFn(childGroupParams, headers),
    }),
    queryClient.prefetchQuery({
      queryKey: generalAlertsQueryKey,
      queryFn: async () => await generalAlertsQueryFn(headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BudgetSettings platform={platform} />
    </HydrationBoundary>
  );
};
