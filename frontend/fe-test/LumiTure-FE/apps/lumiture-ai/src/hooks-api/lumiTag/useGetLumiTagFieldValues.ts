import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTagFieldValuesItem } from './lumiTag.type';

type LumiTagFieldValuesResponse = ResponseGenerics<LumiTagFieldValuesItem[]>;

export const getLumiTagFieldValuesQueryKey = () => ['lumitag', 'field-values'];

export const lumiTagFieldValuesQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<LumiTagFieldValuesResponse>('/lumitag/field-values/', {
    headers,
  });
  return res.data;
};

export const useGetLumiTagFieldValues = (options?: UseQueryOptions<LumiTagFieldValuesResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<LumiTagFieldValuesResponse>({
    queryKey: getLumiTagFieldValuesQueryKey(),
    queryFn: async () => await lumiTagFieldValuesQueryFn(headers),
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
