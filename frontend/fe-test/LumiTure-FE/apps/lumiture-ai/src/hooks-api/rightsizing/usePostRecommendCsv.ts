import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RecommendStatus } from './rightsizing.type';

interface PostRecommendCsvResponse extends ResponseGenerics<{ link: string }> {}

interface PostRecommendCsvPayload {
  status: RecommendStatus;
}
export const usePostRecommendCsv = (
  options?: UseMutationOptions<PostRecommendCsvResponse, AxiosError, PostRecommendCsvPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/rightsizing', 'recommend', 'csv'],
    mutationFn: async (payload: PostRecommendCsvPayload) => {
      const res = await axiosInstance().post<PostRecommendCsvResponse>(
        '/rightsizing/recommend/csv',
        payload,
        {
          headers,
        }
      );
      return res.data;
    },
    ...options,
  });
};
