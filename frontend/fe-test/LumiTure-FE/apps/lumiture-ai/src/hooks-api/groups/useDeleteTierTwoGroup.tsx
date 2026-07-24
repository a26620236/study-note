import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { TierTwoGroupPayload } from './groups.type';

export const useDeleteTierTwoGroup = () => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/groups', 'tier-two', 'delete'],
    mutationFn: async ({ tierOneGroupId, tierTwoGroupId }: TierTwoGroupPayload) =>
      await axiosInstance().delete<GeneralMutationResponse>(
        `/groups/tier-one/${tierOneGroupId}/tier-two/${tierTwoGroupId}`,
        {
          headers,
        }
      ),
  });
};
