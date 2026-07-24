import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { PlatformsValue } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSFilter, AzureFilter, GCPFilter } from './dashboard.type';

export type PostDashboardAnalysisPayload =
  | Omit<GCPFilter, 'platform' | 'currency'>
  | Omit<AWSFilter, 'platform' | 'currency'>
  | Omit<AzureFilter, 'platform' | 'currency'>;

export const usePostDashboardAnalysis = (
  platform: PlatformsValue,
  options?: UseMutationOptions<unknown, AxiosError, PostDashboardAnalysisPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/dashboard', 'analysis', platform, 'summary'],
    mutationFn: async (payload: PostDashboardAnalysisPayload) =>
      await axiosInstance().post<PostDashboardAnalysisPayload>(
        `/dashboard/analysis/${platform}/summary/`,
        payload,
        {
          headers,
        }
      ),
    ...options,
  });
};
