import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { OverviewPeriod } from '../dashboard.type';
import type { DateString, OverviewByCloud } from './dashboard.type';

type OverviewByCloudResponse = ResponseGenerics<OverviewByCloud>;

interface OverviewByCloudQueryParams {
  freq: OverviewPeriod;
  period: DateString;
}

export const overviewByCloudQueryKey = (params: OverviewByCloudQueryParams) => [
  'dashboard',
  'overview',
  'by_cloud',
  params.freq,
  params.period,
];

export const overviewByCloudQueryFn = async (
  params: OverviewByCloudQueryParams,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<OverviewByCloudResponse>('/dashboard/overview/by_cloud', {
    params,
    headers,
  });
  return res.data;
};

export const useGetOverviewByCloud = (
  params: OverviewByCloudQueryParams,
  options?: UseQueryOptions<OverviewByCloudResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<OverviewByCloudResponse>({
    queryKey: overviewByCloudQueryKey(params),
    queryFn: async () => await overviewByCloudQueryFn(params, headers),
    enabled: hasToken,
    ...options,
  });
};
