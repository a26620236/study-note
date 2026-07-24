import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { CurrentGroupBudget, Segment } from './budget.type';

type SpendingRankingsResponse = ResponseGenerics<CurrentGroupBudget>;

interface CurrentGroupBudgetQueryParams {
  segment: Segment;
  fiscalYear?: number;
}

export const currentGroupBudgetBaseQueryKey = ['budget', 'current_group'];

export const currentGroupBudgetQueryKey = (params: CurrentGroupBudgetQueryParams) => [
  ...currentGroupBudgetBaseQueryKey,
  params.segment,
  params.fiscalYear,
];

export const currentGroupBudgetQueryFn = async (
  params: CurrentGroupBudgetQueryParams,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<SpendingRankingsResponse>('/budget/current_group', {
    params,
    headers,
  });
  return res.data;
};

export const useGetCurrentGroupBudget = (
  params: CurrentGroupBudgetQueryParams,
  options?: UseQueryOptions<SpendingRankingsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<SpendingRankingsResponse>({
    queryKey: currentGroupBudgetQueryKey(params),
    queryFn: async () => await currentGroupBudgetQueryFn(params, headers),
    enabled: hasToken,
    ...options,
  });
};
