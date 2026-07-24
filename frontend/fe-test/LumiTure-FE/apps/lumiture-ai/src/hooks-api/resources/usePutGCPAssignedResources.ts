import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface GCPAssignedResourcesPayload {
  groupId: string;
  projectIds: string[];
}

export const usePutGCPAssignedResources = (
  options?: UseMutationOptions<unknown, AxiosError<{ detail: string }>, GCPAssignedResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['put', 'gcp', 'resources', 'assign'],
    mutationFn: async (payload: GCPAssignedResourcesPayload) =>
      await axiosInstance().put('/platforms/gcp/resources/assign/', payload, {
        headers,
      }),
    ...options,
  });
};
