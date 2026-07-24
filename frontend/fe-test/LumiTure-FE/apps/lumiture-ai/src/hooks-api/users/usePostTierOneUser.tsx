import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';
import type { InviteUserPayload } from './users.type';

export const usePostTierOneUser = (tierOneGroupId: InviteUserPayload['tierOneGroupId']) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['users', 'tier-one', tierOneGroupId, 'invite'],
    mutationFn: async ({ role, userEmails }: InviteUserPayload) => {
      const payload = {
        role,
        userEmails: userEmails ? userEmails.split(',').map((email) => email.trim()) : [],
      };
      return await axiosInstance().post<GeneralMutationResponse>(
        `/groups/tier-one/${tierOneGroupId}/add-users/`,
        payload,
        { headers }
      );
    },
  });
};
