import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ErrorResponseGenerics, ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { InviteUserPayload } from './users.type';

export type PostInviteAdminUserErrorResponse = ErrorResponseGenerics<
  string,
  {
    invalidEmails: string[];
  }
>;

export const usePostInviteAdminUser = (
  options?: UseMutationOptions<
    ResponseGenerics,
    AxiosError<PostInviteAdminUserErrorResponse>,
    InviteUserPayload
  >
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['users', 'admin', 'invite'],
    mutationFn: async ({ role, userEmails }: InviteUserPayload) => {
      const payload = {
        role,
        userEmails: userEmails ? userEmails.split(',').map((email) => email.trim()) : [],
      };
      const res = await axiosInstance().post<ResponseGenerics>('/admins/add-users/', payload, {
        headers,
      });
      return res.data;
    },
    ...options,
  });
};
