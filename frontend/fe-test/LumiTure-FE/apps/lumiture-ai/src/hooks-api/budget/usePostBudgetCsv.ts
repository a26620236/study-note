import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { Segment } from './budget.type';

export interface PostBudgetCsvPayload {
  fiscalYear: number;
  segment: Segment;
}

export interface PostBudgetCsvData {
  link: string;
}

export type PostBudgetCsvResponse = ResponseGenerics<PostBudgetCsvData>;

export const usePostBudgetCsv = (
  options?: UseMutationOptions<PostBudgetCsvResponse, AxiosError, PostBudgetCsvPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/budget', 'csv', 'create'],
    mutationFn: async (payload: PostBudgetCsvPayload) => {
      const res = await axiosInstance().post<PostBudgetCsvResponse>('/budget/csv', payload, {
        headers,
      });
      return res.data;
    },
    ...options,
  });
};
