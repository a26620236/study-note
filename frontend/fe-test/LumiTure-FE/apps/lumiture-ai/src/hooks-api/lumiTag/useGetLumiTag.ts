import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTag } from './lumiTag.type';

export type LumiTagResponse = ResponseGenerics<LumiTag>;

export const getLumiTagQueryKey = (tagId: string) => ['lumitag', tagId];

export const lumiTagQueryFn = async (headers: RawAxiosRequestHeaders, tagId: string) => {
  const res = await axiosInstance().get<LumiTagResponse>(`/lumitag/${tagId}/`, { headers });
  return res.data;
};

export const useGetLumiTag = (tagId: string, options?: UseQueryOptions<LumiTagResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<LumiTagResponse>({
    queryKey: getLumiTagQueryKey(tagId),
    queryFn: async () => await lumiTagQueryFn(headers, tagId),
    enabled: hasToken && Boolean(tagId),
    ...options,
  });
};
