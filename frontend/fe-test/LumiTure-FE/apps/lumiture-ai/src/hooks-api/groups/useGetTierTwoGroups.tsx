import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetTierTwoGroupsResponse } from './groups.type';

type TierTwoGroupsResponse = ResponseGenerics<GetTierTwoGroupsResponse>;

export const tierTwoGroupsQueryKey = (tierOneGroupId: string) => [
  'groups',
  'tier-two',
  tierOneGroupId,
];

export const tierTwoGroupsQueryFn = async (
  tierOneGroupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<TierTwoGroupsResponse>(
    `/groups/tier-one/${tierOneGroupId}/tier-two/`,
    { headers }
  );
  return res.data;
};

export const useGetTierTwoGroups = (
  tierOneGroupId: string,
  options?: UseQueryOptions<TierTwoGroupsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<TierTwoGroupsResponse>({
    queryKey: tierTwoGroupsQueryKey(tierOneGroupId),
    queryFn: async () => await tierTwoGroupsQueryFn(tierOneGroupId, headers),
    enabled: !!tierOneGroupId && hasToken,
    ...options,
  });
};
