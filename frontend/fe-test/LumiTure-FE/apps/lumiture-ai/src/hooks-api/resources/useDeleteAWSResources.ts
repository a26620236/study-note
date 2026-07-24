import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface AWSResourcesPayload {
  groupId: string;
  accountIds: string[];
}

export const useDeleteAWSResources = (
  options?: UseMutationOptions<unknown, AxiosError, AWSResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['aws', 'resources', 'remove'],
    mutationFn: async (payload: AWSResourcesPayload) =>
      await axiosInstance().delete('/platforms/aws/resources/remove/', {
        headers,
        data: payload,
      }),
    ...options,
  });
};
