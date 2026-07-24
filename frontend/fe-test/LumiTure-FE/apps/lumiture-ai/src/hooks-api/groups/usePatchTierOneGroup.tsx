import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { EditGroupPayload, TierOneGroupPayload } from './groups.type';

export const usePatchTierOneGroup = (
  options?: UseMutationOptions<unknown, AxiosError, EditGroupPayload & TierOneGroupPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/groups', 'tier-one', 'update'],
    mutationFn: async ({ groupName, tierOneGroupId }: EditGroupPayload & TierOneGroupPayload) => {
      const payload = { name: groupName };
      return await axiosInstance().patch<EditGroupPayload>(
        `/groups/tier-one/${tierOneGroupId}`,
        payload,
        {
          headers,
        }
      );
    },
    ...options,
  });
};
