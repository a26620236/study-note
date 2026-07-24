import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { EditGroupPayload } from './groups.type';

export const usePostCreateTierTwoGroup = ({ tierOneGroupId }: { tierOneGroupId: string }) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/groups', 'tier-two', tierOneGroupId, 'create'],
    mutationFn: async ({ groupName, managerEmails }: EditGroupPayload) => {
      const emails = managerEmails ? managerEmails.split(',').map((email) => email.trim()) : [];
      const payload = {
        name: groupName,
        manager_emails: emails,
      };

      return await axiosInstance().post<EditGroupPayload>(
        `/groups/tier-one/${tierOneGroupId}/tier-two/`,
        payload,
        {
          headers,
        }
      );
    },
  });
};
