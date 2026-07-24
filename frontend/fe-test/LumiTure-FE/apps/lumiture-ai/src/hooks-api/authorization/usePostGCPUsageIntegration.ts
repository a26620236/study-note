import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';

export interface PostGCPUsageIntegrationPayload {
  scopingProjectId: string;
}

export const usePostGCPUsageIntegration = (
  options?: UseMutationOptions<GeneralMutationResponse, AxiosError, PostGCPUsageIntegrationPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/platforms/gcp/usage/integration', 'create'],
    mutationFn: async (payload: PostGCPUsageIntegrationPayload) => {
      const res = await axiosInstance().post<GeneralMutationResponse>(
        '/platforms/gcp/usage/integration',
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
