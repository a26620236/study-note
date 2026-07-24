import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { UserActivityFiltersData } from './audit.type';

export type UserActivityFiltersResponse = ResponseGenerics<UserActivityFiltersData>;

export const userActivityFiltersQueryKey = () => ['audit', 'activity-log', 'filters'];

export const userActivityFiltersQueryFn = async (
  headers: RawAxiosRequestHeaders
): Promise<UserActivityFiltersResponse> => {
  const res = await axiosInstance().get<UserActivityFiltersResponse>(
    '/audit/activity-log/filters',
    { headers }
  );
  return res.data;
};

export const useGetUserActivityFilters = (
  options?: UseQueryOptions<UserActivityFiltersResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<UserActivityFiltersResponse>({
    queryKey: userActivityFiltersQueryKey(),
    queryFn: async () => await userActivityFiltersQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
