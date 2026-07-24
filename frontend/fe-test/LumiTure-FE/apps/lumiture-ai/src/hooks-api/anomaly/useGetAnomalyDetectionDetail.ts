import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AnomalyDetectionDetail } from './anomaly.type';

type AnomalyDetectionDetailResponse = ResponseGenerics<AnomalyDetectionDetail>;

export const anomalyDetectionDetailQueryKey = (alertId: string) => [
  'budget',
  'anomaly-detection',
  alertId,
];

export const anomalyDetectionDetailQueryFn = async (
  alertId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<AnomalyDetectionDetailResponse>(
    `/budget/anomaly-detection/${alertId}`,
    { headers }
  );
  return res.data;
};

export const useGetAnomalyDetectionDetail = ({ alertId }: { alertId: string }) => {
  const { headers, hasToken } = useAuthHeaders();

  return useQuery<AnomalyDetectionDetailResponse>({
    queryKey: anomalyDetectionDetailQueryKey(alertId),
    queryFn: async () => await anomalyDetectionDetailQueryFn(alertId, headers),
    enabled: !!alertId && hasToken,
  });
};
