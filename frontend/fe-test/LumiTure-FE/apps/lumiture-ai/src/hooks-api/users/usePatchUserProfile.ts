import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { User } from 'next-auth';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GeneralMutationResponse } from '../general.api';

export interface PatchUserPayload {
  currency?: User['currency'];
}

export const usePatchUserProfile = (
  userId?: string,
  options?: UseMutationOptions<unknown, AxiosError, PatchUserPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['user', 'update'],
    mutationFn: async (payload: PatchUserPayload) =>
      await axiosInstance().patch<GeneralMutationResponse>(`/user/${userId}`, payload, { headers }),
    ...options,
  });
};
