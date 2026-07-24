import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';

export interface DeleteRemoveUserPayload {
  userGroups: {
    userId: string;
    groupId: string;
  }[];
}

export const useDeleteUser = () => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['users', 'delete'],
    mutationFn: async ({ userGroups }: DeleteRemoveUserPayload) => {
      const payload = { userGroups };
      return await axiosInstance().post<GeneralMutationResponse>(
        '/user/remove-users-group',
        payload,
        {
          headers,
        }
      );
    },
  });
};
