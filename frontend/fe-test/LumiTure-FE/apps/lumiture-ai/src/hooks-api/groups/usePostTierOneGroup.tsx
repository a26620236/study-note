import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { EditGroupPayload } from './groups.type';

export const usePostTierOneGroup = (
  options?: UseMutationOptions<unknown, AxiosError, EditGroupPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/groups', 'tier-one', 'create'],
    mutationFn: async ({ groupName, managerEmails }: EditGroupPayload) => {
      const emails = managerEmails ? managerEmails.split(',').map((email) => email.trim()) : [];
      const payload = {
        name: groupName,
        manager_emails: emails,
      };
      return await axiosInstance().post<EditGroupPayload>('/groups/tier-one/', payload, {
        headers,
      });
    },
    ...options,
  });
};
