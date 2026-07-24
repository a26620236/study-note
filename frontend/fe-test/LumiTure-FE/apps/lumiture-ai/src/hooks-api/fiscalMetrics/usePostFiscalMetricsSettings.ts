import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ValidatedFiscalMetricsData } from '@app/(main)/dashboard/executive-insights/settings/hooks/useFiscalMetricsForm';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

type PostFiscalMetricsSettingsPayload = ValidatedFiscalMetricsData;

export const usePostFiscalMetricsSettings = (
  options?: UseMutationOptions<unknown, AxiosError, PostFiscalMetricsSettingsPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/dashboard/fiscal-metrics/settings', 'create'],
    mutationFn: async (payload: PostFiscalMetricsSettingsPayload) =>
      await axiosInstance().post('/dashboard/fiscal-metrics/settings', payload, {
        headers,
      }),
    ...options,
  });
};
