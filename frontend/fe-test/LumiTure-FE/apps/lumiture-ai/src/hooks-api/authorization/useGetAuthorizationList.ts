import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AuthorizationList } from './authorization.type';

type AuthorizationListResponse = ResponseGenerics<AuthorizationList>;

export const authorizationListQueryKey = ['platforms', 'authorization', 'list'];

export const authorizationListQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AuthorizationListResponse>(
    '/platforms/authorization/list/',
    { headers }
  );
  return res.data;
};

export const useGetAuthorizationList = (options?: UseQueryOptions<AuthorizationListResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AuthorizationListResponse>({
    queryKey: authorizationListQueryKey,
    queryFn: async () => await authorizationListQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
