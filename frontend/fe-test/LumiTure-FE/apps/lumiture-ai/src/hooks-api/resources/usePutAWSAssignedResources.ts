import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface AWSAssignedResourcesPayload {
  groupId: string;
  accountIds: string[];
}

export const usePutAWSAssignedResources = (
  options?: UseMutationOptions<unknown, AxiosError, AWSAssignedResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['put', 'aws', 'resources', 'assign'],
    mutationFn: async (payload: AWSAssignedResourcesPayload) =>
      await axiosInstance().put('/platforms/aws/resources/assign/', payload, {
        headers,
      }),
    ...options,
  });
};
