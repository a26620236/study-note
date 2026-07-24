import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { InviteUserPayload } from './users.type';

export const usePostTierTwoUser = (
  tierOneGroupId: InviteUserPayload['tierOneGroupId'],
  tierTwoGroupId: InviteUserPayload['tierTwoGroupId']
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['users', 'tier-two', tierOneGroupId, tierTwoGroupId, 'invite'],
    mutationFn: async ({ tierOneGroupId, tierTwoGroupId, role, userEmails }: InviteUserPayload) => {
      const payload = {
        role,
        userEmails: userEmails ? userEmails.split(',').map((email) => email.trim()) : [],
      };
      return await axiosInstance().post<GeneralMutationResponse>(
        `/groups/tier-one/${tierOneGroupId}/tier-two/${tierTwoGroupId}/add-users/`,
        payload,
        {
          headers,
        }
      );
    },
  });
};
