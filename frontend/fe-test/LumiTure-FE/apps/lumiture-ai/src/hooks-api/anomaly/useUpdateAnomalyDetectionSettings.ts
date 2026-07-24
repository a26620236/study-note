import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { UpdateAnomalyDetectionSettingsPayload } from './anomaly.type';

export const useUpdateAnomalyDetectionSettings = (
  options?: UseMutationOptions<
    GeneralMutationResponse,
    AxiosError,
    UpdateAnomalyDetectionSettingsPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['budget', 'anomaly-detection', 'post', 'settings'],
    mutationFn: async (payload: UpdateAnomalyDetectionSettingsPayload) => {
      const res = await axiosInstance().post<GeneralMutationResponse>(
        `/budget/anomaly-detection/settings`,
        payload,
        {
          headers,
        }
      );
      return res.data;
    },
    ...options,
  });
};
