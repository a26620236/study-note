import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface AzureAssignedResourcesPayload {
  groupId: string;
  resourceGroupIds: string[];
}

export const usePutAzureAssignedResources = (
  options?: UseMutationOptions<unknown, AxiosError, AzureAssignedResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['azure', 'resources', 'assign'],
    mutationFn: async (payload: AzureAssignedResourcesPayload) =>
      await axiosInstance().put('/platforms/azure/resources/assign/', payload, {
        headers,
      }),
    ...options,
  });
};
