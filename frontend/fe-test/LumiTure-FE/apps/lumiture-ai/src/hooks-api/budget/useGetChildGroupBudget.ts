import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { BudgetPlatformValue, ChildGroupBudget, Segment } from './budget.type';

type SpendingRankingsResponse = ResponseGenerics<ChildGroupBudget>;

interface ChildGroupBudgetQueryParams {
  platform: BudgetPlatformValue;
  segment: Segment;
  fiscalYear?: number;
}

export const childGroupBudgetBaseQueryKey = ['budget', 'child_groups'];
export const childGroupBudgetQueryKey = (params: ChildGroupBudgetQueryParams) => [
  ...childGroupBudgetBaseQueryKey,
  params.platform,
  params.segment,
  params.fiscalYear,
];

export const childGroupBudgetQueryFn = async (
  params: ChildGroupBudgetQueryParams,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<SpendingRankingsResponse>('/budget/child_groups', {
    params,
    headers,
  });
  return res.data;
};

export const useGetChildGroupBudget = (
  params: ChildGroupBudgetQueryParams,
  options?: UseQueryOptions<SpendingRankingsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<SpendingRankingsResponse>({
    queryKey: childGroupBudgetQueryKey(params),
    queryFn: async () => await childGroupBudgetQueryFn(params, headers),
    enabled: hasToken,
    ...options,
  });
};
