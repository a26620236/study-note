import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GroupUsers, UsersPayload } from './users.type';

type TierTwoUsersResponse = ResponseGenerics<GroupUsers>;

export const tierTwoUsersQueryKey = (
  tierOneGroupId: UsersPayload['tierOneGroupId'],
  tierTwoGroupId: UsersPayload['tierTwoGroupId']
) => ['/groups', 'users', 'tier-two', tierOneGroupId, tierTwoGroupId];

export const tierTwoUsersQueryFn = async (
  tierOneGroupId: UsersPayload['tierOneGroupId'],
  tierTwoGroupId: UsersPayload['tierTwoGroupId'],
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<TierTwoUsersResponse>(
    `/groups/tier-one/${tierOneGroupId}/tier-two/${tierTwoGroupId}/users`,
    { headers }
  );
  return res.data;
};

export const useGetTierTwoUsers = (
  tierOneGroupId: UsersPayload['tierOneGroupId'],
  tierTwoGroupId: UsersPayload['tierTwoGroupId'],
  options?: UseQueryOptions<TierTwoUsersResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<TierTwoUsersResponse>({
    queryKey: tierTwoUsersQueryKey(tierOneGroupId, tierTwoGroupId),
    queryFn: async () => await tierTwoUsersQueryFn(tierOneGroupId, tierTwoGroupId, headers),
    enabled: !!tierOneGroupId && !!tierTwoGroupId && hasToken,
    ...options,
  });
};
