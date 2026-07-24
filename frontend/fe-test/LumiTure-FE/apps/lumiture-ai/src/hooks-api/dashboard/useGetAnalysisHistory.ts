import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AnalysisHistoryItem } from './dashboard.type';

export type AnalysisHistoryResponse = ResponseGenerics<AnalysisHistoryItem[]>;

export const analysisHistoryQueryKey = ['/dashboard', 'analysis', 'summary', 'history'];

export const analysisHistoryQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AnalysisHistoryResponse>(
    '/dashboard/analysis/summary/history/',
    {
      headers,
    }
  );
  return res.data;
};

export const useGetAnalysisHistory = (options?: UseQueryOptions<AnalysisHistoryResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AnalysisHistoryResponse>({
    queryKey: analysisHistoryQueryKey,
    queryFn: async () => await analysisHistoryQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
