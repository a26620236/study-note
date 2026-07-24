import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AzureResourceGroup } from './resources.type';

type AzureResourceGroupResponse = ResponseGenerics<AzureResourceGroup>;

interface CheckAzureResourcesPayload {
  groupId: string;
  resourceGroupIds: string[];
}

export const useCheckAzureResource = (
  options?: UseMutationOptions<AzureResourceGroupResponse, AxiosError, CheckAzureResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['azure', 'resources', 'group', 'check'],
    mutationFn: async (payload: CheckAzureResourcesPayload) => {
      const res = await axiosInstance().post<AzureResourceGroupResponse>(
        '/platforms/azure/resources/group-check/',
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
