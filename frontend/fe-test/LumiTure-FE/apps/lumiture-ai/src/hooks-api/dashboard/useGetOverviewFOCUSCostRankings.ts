import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { OverviewPeriod } from '../dashboard.type';
import type { DateString, OverviewFOCUSCostRankings } from './dashboard.type';

type OverviewFOCUSCostRankingsResponse = ResponseGenerics<OverviewFOCUSCostRankings>;
interface OverviewFOCUSCostRankingsQueryParams {
  freq: OverviewPeriod;
  period: DateString;
}

export const overviewFOCUSCostRankingsQueryKey = (params: OverviewFOCUSCostRankingsQueryParams) => [
  'dashboard',
  'overview',
  'by-focus',
  params,
];

export const overviewFOCUSCostRankingsQueryFn = async (
  headers: RawAxiosRequestHeaders,
  params: OverviewFOCUSCostRankingsQueryParams
) => {
  const res = await axiosInstance().get<OverviewFOCUSCostRankingsResponse>(
    '/dashboard/overview/by-focus',
    {
      headers,
      params,
    }
  );
  return res.data;
};

export const useGetOverviewFOCUSCostRankings = (
  params: OverviewFOCUSCostRankingsQueryParams,
  options?: UseQueryOptions<OverviewFOCUSCostRankingsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<OverviewFOCUSCostRankingsResponse>({
    queryKey: overviewFOCUSCostRankingsQueryKey(params),
    queryFn: async () => await overviewFOCUSCostRankingsQueryFn(headers, params),
    enabled: hasToken,
    ...options,
  });
};
