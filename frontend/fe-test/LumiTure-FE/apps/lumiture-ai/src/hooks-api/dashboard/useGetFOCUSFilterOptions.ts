import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import type { CrossCloudValue } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { FOCUSFilterOptions } from './dashboard.type';

type FOCUSFilterOptionsResponse = ResponseGenerics<FOCUSFilterOptions>;

interface FOCUSFilterOptionsQueryParams {
  start_date: string;
  end_date: string;
}

export const focusFilterOptionsQueryKey = (
  platform: CrossCloudValue,
  params: FOCUSFilterOptionsQueryParams
) => ['dashboard', platform, 'filter_options', params.start_date, params.end_date];

export const focusFilterOptionsQueryFn = async (
  platform: CrossCloudValue,
  params: FOCUSFilterOptionsQueryParams,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<FOCUSFilterOptionsResponse>(
    `/dashboard/analysis/${platform}/filter_options`,
    {
      params,
      headers,
    }
  );
  return res.data;
};

export const useGetFOCUSFilterOptions = (
  platform: CrossCloudValue,
  params: FOCUSFilterOptionsQueryParams,
  options?: UseQueryOptions<FOCUSFilterOptionsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<FOCUSFilterOptionsResponse>({
    queryKey: focusFilterOptionsQueryKey(platform, params),
    queryFn: async () => await focusFilterOptionsQueryFn(platform, params, headers),
    enabled: hasToken && !!params.start_date && !!params.end_date,
    ...options,
  });
};
