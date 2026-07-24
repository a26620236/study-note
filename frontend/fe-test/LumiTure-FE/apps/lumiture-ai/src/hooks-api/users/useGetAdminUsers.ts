import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GroupUsers } from './users.type';

type AdminUsersResponse = ResponseGenerics<GroupUsers>;

export const adminUsersQueryKey = () => ['/admins', 'users'];

export const adminUsersQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AdminUsersResponse>('/admins/users/', { headers });
  return res.data;
};

export const useGetAdminUsers = (options?: UseQueryOptions<AdminUsersResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AdminUsersResponse>({
    queryKey: adminUsersQueryKey(),
    queryFn: async () => await adminUsersQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
