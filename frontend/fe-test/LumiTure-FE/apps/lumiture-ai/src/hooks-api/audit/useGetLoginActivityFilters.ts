import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LoginActivityFiltersData } from './audit.type';

export type LoginActivityFiltersResponse = ResponseGenerics<LoginActivityFiltersData>;

export const loginActivityFiltersQueryKey = () => ['audit', 'login-log', 'filters'];

export const loginActivityFiltersQueryFn = async (
  headers: RawAxiosRequestHeaders
): Promise<LoginActivityFiltersResponse> => {
  const res = await axiosInstance().get<LoginActivityFiltersResponse>('/audit/login-log/filters', {
    headers,
  });
  return res.data;
};

export const useGetLoginActivityFilters = (
  options?: UseQueryOptions<LoginActivityFiltersResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<LoginActivityFiltersResponse>({
    queryKey: loginActivityFiltersQueryKey(),
    queryFn: async () => await loginActivityFiltersQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
