import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LoginActivityListPayload } from './useGetLoginActivityList';

export type LoginActivityExportPayload = Omit<LoginActivityListPayload, 'page'>;
export type LoginActivityExportResponse = ResponseGenerics<null>;

export const usePostLoginActivityExport = (
  options?: UseMutationOptions<LoginActivityExportResponse, AxiosError, LoginActivityExportPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['audit', 'login-log', 'export'],
    mutationFn: async (payload: LoginActivityExportPayload) => {
      const res = await axiosInstance().post<LoginActivityExportResponse>(
        '/audit/login-log/export',
        payload,
        { headers }
      );
      return res.data;
    },
    ...options,
  });
};
