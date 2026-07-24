import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AzureUsageCustomRole } from './authorization.type';

type AzureUsageCustomRoleResponse = ResponseGenerics<AzureUsageCustomRole>;

export const azureUsageCustomRoleQueryKey = (subscriptionId: string) => [
  'platforms',
  'azure',
  'authorization',
  'usage-custom-role',
  subscriptionId,
];

export const azureUsageCustomRoleQueryFn = async (
  headers: RawAxiosRequestHeaders,
  subscriptionId: string
) => {
  const res = await axiosInstance().get<AzureUsageCustomRoleResponse>(
    '/platforms/azure/authorization/usage-custom-role',
    { headers, params: { subscriptionId } }
  );
  return res.data;
};

export const useGetAzureUsageCustomRole = (
  subscriptionId: string | null,
  options?: UseQueryOptions<AzureUsageCustomRoleResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AzureUsageCustomRoleResponse>({
    queryKey: azureUsageCustomRoleQueryKey(subscriptionId ?? ''),
    queryFn: async () => await azureUsageCustomRoleQueryFn(headers, subscriptionId ?? ''),
    enabled: hasToken && !!subscriptionId,
    ...options,
  });
};
