import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface PatchFiscalStartMonthPayload {
  month: number;
}

export const usePatchFiscalStartMonth = (
  options?: UseMutationOptions<unknown, AxiosError, PatchFiscalStartMonthPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/dashboard/fiscal-metrics/settings', 'update'],
    mutationFn: async ({ month }: PatchFiscalStartMonthPayload) => {
      const payload = { month };
      return await axiosInstance().patch('/dashboard/fiscal-metrics/settings', payload, {
        headers,
      });
    },
    ...options,
  });
};
