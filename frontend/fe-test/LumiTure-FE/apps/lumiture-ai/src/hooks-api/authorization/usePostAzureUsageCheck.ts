import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ErrorResponseGenerics, ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

export interface AzureUsageCheckPayload {
  subscriptionId: string;
}

type AzureUsageCheckErrorResponse = ErrorResponseGenerics;

export const usePostAzureUsageCheck = (
  options?: UseMutationOptions<
    ResponseGenerics,
    AxiosError<AzureUsageCheckErrorResponse>,
    AzureUsageCheckPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['platforms', 'azure', 'authorization', 'usage-check'],
    mutationFn: async (payload: AzureUsageCheckPayload) => {
      const res = await axiosInstance().post<ResponseGenerics>(
        '/platforms/azure/authorization/usage-check/',
        payload,
        { headers }
      );
      return res.data;
    },
    ...options,
  });
};
