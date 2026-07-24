import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';

export interface PostAzureBillingIntegrationPayload {
  tenantId: string;
  subscriptionId: string;
}

type PostAzureBillingIntegrationResponse =
  | GeneralMutationResponse
  | ResponseGenerics<{ url: string }>;

export enum TenantIdError {
  TenantIdInvalid = 'TENANT_ID_INVALID',
}
export enum SubscriptionIdError {
  SubscriptionIdInvalid = 'SUBSCRIPTION_ID_INVALID',
  SubscriptionAlreadyRegistered = 'SUBSCRIPTION_ALREADY_REGISTERED',
}

export enum AzureBillingIntegrationAuthorizationErrorCode {
  BadRequest = 'BAD_REQUEST',
  Conflict = 'CONFLICT',
}

export interface AzureBillingIntegrationAuthorizationError {
  tenantId?: TenantIdError[];
  subscriptionId?: SubscriptionIdError[];
}

export const usePostAzureBillingIntegration = (
  options?: UseMutationOptions<
    PostAzureBillingIntegrationResponse,
    AxiosError,
    PostAzureBillingIntegrationPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/platforms/azure/authorization/admin-consent-url', 'create'],
    mutationFn: async (payload: PostAzureBillingIntegrationPayload) => {
      const res = await axiosInstance().post<PostAzureBillingIntegrationResponse>(
        '/platforms/azure/authorization/admin-consent-url',
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
