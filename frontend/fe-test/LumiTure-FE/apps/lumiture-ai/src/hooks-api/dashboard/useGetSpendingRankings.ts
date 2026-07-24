import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { OverviewPeriod } from '../dashboard.type';
import type { DateString, SpendingRankings } from './dashboard.type';

type SpendingRankingsResponse = ResponseGenerics<SpendingRankings>;

interface SpendingRankingsQueryParams {
  freq: OverviewPeriod;
  period: DateString;
}

export const spendingRankingsQueryKey = (params: SpendingRankingsQueryParams) => [
  'dashboard',
  'overview',
  'spending_rankings',
  params.freq,
  params.period,
];

export const spendingRankingsQueryFn = async (
  params: SpendingRankingsQueryParams,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<SpendingRankingsResponse>(
    '/dashboard/overview/cost_rankings',
    {
      params,
      headers,
    }
  );
  return res.data;
};

export const useGetSpendingRankings = (
  params: SpendingRankingsQueryParams,
  options?: UseQueryOptions<SpendingRankingsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<SpendingRankingsResponse>({
    queryKey: spendingRankingsQueryKey(params),
    queryFn: async () => await spendingRankingsQueryFn(params, headers),
    enabled: hasToken,
    ...options,
  });
};
