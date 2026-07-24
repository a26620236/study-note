import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GroupUsers, UsersPayload } from './users.type';

type TierOneUsersResponse = ResponseGenerics<GroupUsers>;

export const tierOneUsersQueryKey = (tierOneGroupId: UsersPayload['tierOneGroupId']) => [
  '/groups',
  'tier-one',
  'users',
  tierOneGroupId,
];

export const tierOneUsersQueryFn = async (
  tierOneGroupId: UsersPayload['tierOneGroupId'],
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<TierOneUsersResponse>(
    `/groups/tier-one/${tierOneGroupId}/users/`,
    {
      headers,
    }
  );
  return res.data;
};

export const useGetTierOneUsers = (
  tierOneGroupId: UsersPayload['tierOneGroupId'],
  options?: UseQueryOptions<TierOneUsersResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<TierOneUsersResponse>({
    queryKey: tierOneUsersQueryKey(tierOneGroupId),
    queryFn: async () => await tierOneUsersQueryFn(tierOneGroupId, headers),
    enabled: !!tierOneGroupId && hasToken,
    ...options,
  });
};
