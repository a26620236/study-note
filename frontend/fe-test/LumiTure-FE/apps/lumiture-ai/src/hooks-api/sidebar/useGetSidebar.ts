import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { Sidebar } from './sidebar.type';

type SidebarResponse = ResponseGenerics<Sidebar>;

export const sidebarQueryKey = ['/sidebar'];

export const sidebarQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<SidebarResponse>('/sidebar/', {
    headers,
  });
  return res.data;
};

export const useGetSidebar = (options?: UseQueryOptions<SidebarResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<SidebarResponse>({
    queryKey: sidebarQueryKey,
    queryFn: async () => await sidebarQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
