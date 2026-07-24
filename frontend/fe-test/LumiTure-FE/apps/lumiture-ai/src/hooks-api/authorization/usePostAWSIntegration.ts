import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ErrorResponseGenerics, ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSBillingIntegration, AWSBillingIntegrationStatus } from './authorization.type';

export interface AWSIntegrationPayload extends AWSBillingIntegration {}

type AWSIntegrationResponse = ResponseGenerics;
type AWSIntegrationErrorResponse = ErrorResponseGenerics<
  unknown,
  {
    errorCode: AWSBillingIntegrationStatus[];
  }
>;

export const usePostAWSIntegration = (
  options?: UseMutationOptions<
    AWSIntegrationResponse,
    AxiosError<AWSIntegrationErrorResponse>,
    AWSIntegrationPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['platforms', 'aws', 'billing', 'integration'],
    mutationFn: async (payload: AWSIntegrationPayload) => {
      const res = await axiosInstance().post<AWSIntegrationResponse>(
        '/platforms/aws/billing/integration',
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
