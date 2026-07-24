import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AnomalyDetectionListResponse } from './useGetAnomalyDetectionList';

export interface PinnedAnomalyDetectionPayload {
  pin: boolean;
}

export const usePinAnomalyDetection = (
  alertId: number,
  options?: UseMutationOptions<
    unknown,
    AxiosError,
    PinnedAnomalyDetectionPayload,
    { previousData: AnomalyDetectionListResponse | undefined }
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['budget', 'anomaly-detection', 'patch', 'pin'],
    mutationFn: async (payload: PinnedAnomalyDetectionPayload) =>
      await axiosInstance().patch<PinnedAnomalyDetectionPayload>(
        `/budget/anomaly-detection/${alertId}/pin`,
        payload,
        {
          headers,
        }
      ),
    ...options,
  });
};
