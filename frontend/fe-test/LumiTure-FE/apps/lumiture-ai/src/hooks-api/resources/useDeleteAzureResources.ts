import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface AzureResourcesPayload {
  groupId: string;
  resourceGroupIds: string[];
}

export const useDeleteAzureResources = (
  options?: UseMutationOptions<unknown, AxiosError, AzureResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['azure', 'resources', 'remove'],
    mutationFn: async (payload: AzureResourcesPayload) =>
      await axiosInstance().delete('/platforms/azure/resources/remove/', {
        headers,
        data: payload,
      }),
    ...options,
  });
};
