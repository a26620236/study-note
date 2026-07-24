import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { GCPBillingIntegration } from './authorization.type';

export interface GCPBillingIntegrationPayload extends GCPBillingIntegration {}

export const usePostGCPBillingIntegration = (
  options?: UseMutationOptions<GeneralMutationResponse, AxiosError, GCPBillingIntegrationPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['platforms', 'gcp', 'billing', 'integration', 'create'],
    mutationFn: async (payload: GCPBillingIntegrationPayload) => {
      const res = await axiosInstance().post<GeneralMutationResponse>(
        '/platforms/gcp/billing/integration',
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
