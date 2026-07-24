import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GCPResourceGroup } from './resources.type';

type GCPResourceGroupCheckResponse = ResponseGenerics<GCPResourceGroup>;

interface CheckGCPResourcesPayload {
  groupId: string;
  projectIds: string[];
}

export const useCheckGCPResource = (
  options?: UseMutationOptions<GCPResourceGroupCheckResponse, AxiosError, CheckGCPResourcesPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['gcp', 'resources', 'group', 'check'],
    mutationFn: async (payload: CheckGCPResourcesPayload) => {
      const res = await axiosInstance().post<GCPResourceGroupCheckResponse>(
        '/platforms/gcp/resources/group-check/',
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
