import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSResourceGroup } from './resources.type';

type AWSResourceGroupResponse = ResponseGenerics<AWSResourceGroup>;

interface CheckAWSResourcesPayload {
  groupId: string;
  accountIds: string[];
}

export const useCheckAWSResource = (
  options?: UseMutationOptions<AWSResourceGroupResponse, AxiosError, CheckAWSResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['aws', 'resources', 'group', 'check'],
    mutationFn: async (payload: CheckAWSResourcesPayload) => {
      const res = await axiosInstance().post<AWSResourceGroupResponse>(
        '/platforms/aws/resources/group-check/',
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
