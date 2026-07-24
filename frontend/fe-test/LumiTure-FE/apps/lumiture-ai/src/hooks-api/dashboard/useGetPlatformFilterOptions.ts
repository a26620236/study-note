import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';
import { omit } from 'lodash-es';

import type { ResponseGenerics } from '@shared/types';

import type { PlatformsValue } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSFilterOptions, AzureFilterOptions, GCPFilterOptions } from './dashboard.type';

type PlatformFilterOptionsResponse = ResponseGenerics<
  GCPFilterOptions | AWSFilterOptions | AzureFilterOptions
>;

interface PlatformFilterOptionsQueryParams {
  start_date: string;
  end_date: string;
}

export const platformFilterOptionsQueryKey = (
  platform: PlatformsValue,
  params: PlatformFilterOptionsQueryParams
) => ['dashboard', platform, 'filter_options', params.start_date, params.end_date];

export const platformFilterOptionsQueryFn = async (
  platform: PlatformsValue,
  params: PlatformFilterOptionsQueryParams,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<PlatformFilterOptionsResponse>(
    `/dashboard/analysis/${platform}/filter_options`,
    {
      params,
      headers,
    }
  );
  return res.data;
};

export const useGetPlatformFilterOptions = (
  platform: PlatformsValue,
  params: PlatformFilterOptionsQueryParams,
  options?: Omit<UseQueryOptions<PlatformFilterOptionsResponse>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<PlatformFilterOptionsResponse>({
    queryKey: platformFilterOptionsQueryKey(platform, params),
    queryFn: async () => await platformFilterOptionsQueryFn(platform, params, headers),
    enabled: hasToken && !!params.start_date && !!params.end_date && options?.enabled,
    ...omit(options, 'enabled'),
  });
};
