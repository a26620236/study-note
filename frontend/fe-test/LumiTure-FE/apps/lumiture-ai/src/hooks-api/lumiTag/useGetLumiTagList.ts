import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTagList } from './lumiTag.type';

export type LumiTagListResponse = ResponseGenerics<LumiTagList>;

export const getLumiTagListQueryKey = () => ['lumitag'];

export const lumiTagListQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<LumiTagListResponse>('/lumitag/', { headers });
  return res.data;
};

export const useGetLumiTagList = (
  options?: Omit<UseQueryOptions<LumiTagListResponse>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<LumiTagListResponse>({
    queryKey: getLumiTagListQueryKey(),
    queryFn: async () => await lumiTagListQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
