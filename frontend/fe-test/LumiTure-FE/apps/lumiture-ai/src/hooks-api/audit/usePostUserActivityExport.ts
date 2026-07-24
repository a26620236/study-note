import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { UserActivityListPayload } from './useGetUserActivityList';

export type UserActivityExportPayload = Omit<UserActivityListPayload, 'page'>;
export type UserActivityExportResponse = ResponseGenerics<null>;

export const usePostUserActivityExport = (
  options?: UseMutationOptions<UserActivityExportResponse, AxiosError, UserActivityExportPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['audit', 'activity-log', 'export'],
    mutationFn: async (payload: UserActivityExportPayload) => {
      const res = await axiosInstance().post<UserActivityExportResponse>(
        '/audit/activity-log/export',
        payload,
        { headers }
      );
      return res.data;
    },
    ...options,
  });
};
