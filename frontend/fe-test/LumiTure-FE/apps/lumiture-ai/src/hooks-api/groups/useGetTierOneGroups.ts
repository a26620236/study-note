import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetTierOneGroupsResponse } from './groups.type';

type TierOneGroupsResponse = ResponseGenerics<GetTierOneGroupsResponse>;

export const tierOneGroupsQueryKey = ['/groups', 'tier-one'];

export const tierOneGroupsQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<TierOneGroupsResponse>('/groups/tier-one/', {
    headers,
  });
  return res.data;
};

export const useGetTierOneGroups = (options?: UseQueryOptions<TierOneGroupsResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<TierOneGroupsResponse>({
    queryKey: tierOneGroupsQueryKey,
    queryFn: async () => await tierOneGroupsQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
