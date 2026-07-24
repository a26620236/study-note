import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ErrorResponseGenerics, ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSBillingIntegration, AWSBillingPermissionCheckStatus } from './authorization.type';

export interface AWSPermissionCheckPayload extends AWSBillingIntegration {}

type AWSPermissionCheckResponse = ResponseGenerics;
type AWSPermissionCheckErrorResponse = ErrorResponseGenerics<
  unknown,
  {
    errorCode: AWSBillingPermissionCheckStatus[];
  }
>;

export const usePostAWSPermissionCheck = (
  options?: UseMutationOptions<
    AWSPermissionCheckResponse,
    AxiosError<AWSPermissionCheckErrorResponse>,
    AWSPermissionCheckPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['platforms', 'aws', 'billing', 'permission-check'],
    mutationFn: async (payload: AWSPermissionCheckPayload) => {
      const res = await axiosInstance().post<AWSPermissionCheckResponse>(
        '/platforms/aws/billing/permission-check',
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
