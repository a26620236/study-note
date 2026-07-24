import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetUserGroupsResponse } from './auth.type';

type UserGroupsResponse = ResponseGenerics<GetUserGroupsResponse>;

export const userGroupsQueryKey = ['auth', 'get-user-groups'];

export const userGroupsQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<UserGroupsResponse>('/user/groups', { headers });
  return res.data;
};

export const useGetUserGroups = (options?: UseQueryOptions<UserGroupsResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<UserGroupsResponse>({
    queryKey: userGroupsQueryKey,
    queryFn: async () => await userGroupsQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
