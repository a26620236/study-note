import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AnomalyDetectionSettings } from './anomaly.type';

type AnomalyDetectionSettingsResponse = ResponseGenerics<AnomalyDetectionSettings>;

export const anomalyDetectionSettingsQueryKey = () => ['budget', 'anomaly-detection', 'settings'];

export const anomalyDetectionSettingsQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AnomalyDetectionSettingsResponse>(
    `/budget/anomaly-detection/settings`,
    { headers }
  );
  return res.data;
};

export const useGetAnomalyDetectionSettings = () => {
  const { headers, hasToken } = useAuthHeaders();

  return useQuery<AnomalyDetectionSettingsResponse>({
    queryKey: anomalyDetectionSettingsQueryKey(),
    queryFn: async () => await anomalyDetectionSettingsQueryFn(headers),
    enabled: hasToken,
  });
};
