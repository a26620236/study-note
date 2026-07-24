import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AnalysisHistoryResponse } from './useGetAnalysisHistory';

interface PinnedAnalysisSummaryPayload {
  id: string;
  pin: boolean;
}

export const usePinnedAnalysisSummary = (
  options?: UseMutationOptions<
    unknown,
    AxiosError,
    PinnedAnalysisSummaryPayload,
    { previousData: AnalysisHistoryResponse | undefined }
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/dashboard', 'analysis', 'summary', 'history', 'pin'],
    mutationFn: async (payload: PinnedAnalysisSummaryPayload) =>
      await axiosInstance().put<PinnedAnalysisSummaryPayload>(
        '/dashboard/analysis/summary/history/pin/',
        payload,
        {
          headers,
        }
      ),
    ...options,
  });
};
