import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { PlatformsValue } from '@constants';
import { useAuthHeaders } from '@hooks';
import type { AIAnalysis } from '@hooks-ws';
import { axiosInstance } from '@utils';

export const useCancelDashboardAnalysis = (
  platform: PlatformsValue,
  taskId?: AIAnalysis['taskId'],
  options?: UseMutationOptions<unknown, AxiosError, unknown>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/dashboard', 'analysis', platform, 'summary', taskId, 'cancel'],
    mutationFn: async () =>
      await axiosInstance().post(
        `/dashboard/analysis/${platform}/summary/${taskId}/cancel/`,
        null,
        { headers }
      ),
    ...options,
  });
};
