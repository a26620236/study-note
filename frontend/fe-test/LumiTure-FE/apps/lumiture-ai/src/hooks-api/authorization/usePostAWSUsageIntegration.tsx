import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';

export interface PostAWSUsageIntegrationPayload {
  stacksetName: string;
  roleName: string;
  accountId: string;
  externalId: string;
}

export const usePostAWSUsageIntegration = (
  options?: UseMutationOptions<GeneralMutationResponse, AxiosError, PostAWSUsageIntegrationPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/platforms/aws/usage/integration', 'create'],
    mutationFn: async (payload: PostAWSUsageIntegrationPayload) => {
      const res = await axiosInstance().post<GeneralMutationResponse>(
        '/platforms/aws/usage/integration',
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
