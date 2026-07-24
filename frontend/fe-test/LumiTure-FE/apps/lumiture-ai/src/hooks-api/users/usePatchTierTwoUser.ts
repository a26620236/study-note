import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { UpdateUserPayload } from './users.type';

export const usePatchTierTwoUser = (
  tierOneGroupId: UpdateUserPayload['tierOneGroupId'],
  tierTwoGroupId: UpdateUserPayload['tierTwoGroupId']
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['users', 'tier-two', 'update'],
    mutationFn: async ({ userId, role }: UpdateUserPayload) => {
      const payload = { role };
      return await axiosInstance().patch<GeneralMutationResponse>(
        `/groups/tier-one/${tierOneGroupId}/tier-two/${tierTwoGroupId}/users/${userId}/role/`,
        payload,
        {
          headers,
        }
      );
    },
  });
};
