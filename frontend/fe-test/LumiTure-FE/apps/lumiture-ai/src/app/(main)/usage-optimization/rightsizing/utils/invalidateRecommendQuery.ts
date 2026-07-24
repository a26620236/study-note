import type { QueryClient } from '@tanstack/react-query';

import { rightsizingOverviewQueryKey, rightsizingRecommendBaseQueryKey } from '@hooks-api';

export const invalidateRecommendQuery = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: rightsizingRecommendBaseQueryKey,
  });
  queryClient.invalidateQueries({ queryKey: rightsizingOverviewQueryKey });
};
