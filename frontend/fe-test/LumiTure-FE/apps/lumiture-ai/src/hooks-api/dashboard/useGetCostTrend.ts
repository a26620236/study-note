import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSFilter, AzureFilter, CostTrend, FOCUSFilter, GCPFilter } from './dashboard.type';

type CostTrendResponse = ResponseGenerics<CostTrend>;

type CostTrendQueryPayload = GCPFilter | AWSFilter | AzureFilter | FOCUSFilter;

const getPlatformPath = (payload: CostTrendQueryPayload): PlatformValueWithFOCUS => {
  if ('projects' in payload) return PlatformsValue.GCP;
  if ('accounts' in payload) return PlatformsValue.AWS;
  if ('resourceGroups' in payload) return PlatformsValue.AZURE;
  return CrossCloudValue.FOCUS;
};

export const costTrendQueryKey = (payload: CostTrendQueryPayload) => [
  'dashboard',
  'analysis',
  getPlatformPath(payload),
  'cost_trend',
  payload,
];

export const costTrendQueryFn = async (
  payload: CostTrendQueryPayload,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().post<CostTrendResponse>(
    `/dashboard/analysis/${getPlatformPath(payload)}/cost_trend`,
    payload,
    {
      headers,
    }
  );
  return res.data;
};

export const useGetCostTrend = (
  payload: CostTrendQueryPayload,
  options?: Omit<UseQueryOptions<CostTrendResponse>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<CostTrendResponse>({
    queryKey: costTrendQueryKey(payload),
    queryFn: async () => await costTrendQueryFn(payload, headers),
    enabled: hasToken && !!payload.startDate && !!payload.endDate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
