import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { EditGroupPayload, TierTwoGroupPayload } from './groups.type';

export const usePatchTierTwoGroup = () => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/groups', 'tier-two', 'update'],
    mutationFn: async ({
      groupName,
      tierOneGroupId,
      tierTwoGroupId,
    }: EditGroupPayload & TierTwoGroupPayload) => {
      const payload = { name: groupName };
      return await axiosInstance().patch<EditGroupPayload>(
        `/groups/tier-one/${tierOneGroupId}/tier-two/${tierTwoGroupId}`,
        payload,
        {
          headers,
        }
      );
    },
  });
};
