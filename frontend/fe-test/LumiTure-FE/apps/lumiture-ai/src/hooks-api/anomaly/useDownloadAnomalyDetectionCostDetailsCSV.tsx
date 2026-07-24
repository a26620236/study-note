import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface DownloadAnomalyDetectionCostDetailsCSVResponse
  extends ResponseGenerics<{ link: string }> {}

export function useDownloadAnomalyDetectionCostDetailsCSV(
  alertId: string,
  options?: UseMutationOptions<DownloadAnomalyDetectionCostDetailsCSVResponse, AxiosError>
) {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/budget', 'anomaly-detection', 'csv'],
    mutationFn: async () => {
      const res = await axiosInstance().post<DownloadAnomalyDetectionCostDetailsCSVResponse>(
        `/budget/anomaly-detection/${alertId}/csv`,
        null,
        { headers }
      );
      return res.data;
    },
    ...options,
  });
}
