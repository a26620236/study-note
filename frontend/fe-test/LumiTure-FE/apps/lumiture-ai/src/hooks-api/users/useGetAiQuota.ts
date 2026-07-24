import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AiQuota } from './users.type';

export type AiQuotaResponse = ResponseGenerics<AiQuota>;

export const aiQuotaQueryKey = () => ['/user/ai-quota'];

export const aiQuotaQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AiQuotaResponse>('/user/ai-quota/', {
    headers,
  });
  return res.data;
};

export const useGetAiQuota = (options?: UseQueryOptions<AiQuotaResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AiQuotaResponse>({
    queryKey: aiQuotaQueryKey(),
    queryFn: async () => await aiQuotaQueryFn(headers),
    enabled: hasToken,
    refetchOnWindowFocus: true,
    ...options,
  });
};
