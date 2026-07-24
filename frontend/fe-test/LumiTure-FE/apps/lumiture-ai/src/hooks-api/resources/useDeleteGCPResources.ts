import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface GCPResourcesPayload {
  groupId: string;
  projectIds: string[];
}

export const useDeleteGCPResources = (
  options?: UseMutationOptions<unknown, AxiosError, GCPResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['gcp', 'resources', 'remove'],
    mutationFn: async (payload: GCPResourcesPayload) =>
      await axiosInstance().delete('/platforms/gcp/resources/remove/', {
        headers,
        data: payload,
      }),
    ...options,
  });
};
