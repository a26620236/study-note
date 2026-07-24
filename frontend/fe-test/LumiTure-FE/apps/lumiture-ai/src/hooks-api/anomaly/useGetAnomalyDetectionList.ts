import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AnomalyDetectionItem } from './anomaly.type';

export type AnomalyDetectionListResponse = ResponseGenerics<AnomalyDetectionItem[]>;

export const anomalyDetectionListQueryKey = () => ['budget', 'anomaly-detection'];

export const anomalyDetectionListQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AnomalyDetectionListResponse>(`/budget/anomaly-detection`, {
    headers,
  });
  return res.data;
};

export const useGetAnomalyDetectionList = () => {
  const { headers, hasToken } = useAuthHeaders();

  return useQuery<AnomalyDetectionListResponse>({
    queryKey: anomalyDetectionListQueryKey(),
    queryFn: async () => await anomalyDetectionListQueryFn(headers),
    enabled: hasToken,
  });
};
