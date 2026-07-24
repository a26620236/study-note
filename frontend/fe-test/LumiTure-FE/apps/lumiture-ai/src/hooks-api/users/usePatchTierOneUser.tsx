import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { UpdateUserPayload, UsersPayload } from './users.type';

export const usePatchTierOneUser = (
  tierOneGroupId: UsersPayload['tierOneGroupId'],
  options?: UseMutationOptions<unknown, AxiosError, UpdateUserPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['users', 'tier-one', 'update'],
    mutationFn: async ({ userId, role }: UpdateUserPayload) => {
      const payload = { role };
      return await axiosInstance().patch<GeneralMutationResponse>(
        `/groups/tier-one/${tierOneGroupId}/users/${userId}/role/`,
        payload,
        {
          headers,
        }
      );
    },
    ...options,
  });
};
