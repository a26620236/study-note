import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { TierOneGroupPayload } from './groups.type';

export const useDeleteTierOneGroup = (
  options?: UseMutationOptions<unknown, AxiosError, TierOneGroupPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/groups', 'tier-one', 'delete'],
    mutationFn: async ({ tierOneGroupId }: TierOneGroupPayload) =>
      await axiosInstance().delete<TierOneGroupPayload>(`/groups/tier-one/${tierOneGroupId}`, {
        headers,
      }),
    ...options,
  });
};
