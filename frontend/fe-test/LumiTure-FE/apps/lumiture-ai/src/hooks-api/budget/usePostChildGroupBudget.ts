import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';

import type { PlatformsValue } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

export interface ChildGroupBudgetItemPayload {
  id: number;
  name: string;
  budgets: { period: string; value: number | null }[];
}

interface ChildGroupBudgetPayload {
  platform: PlatformsValue;
  // 後續 phase 串接：save 流程帶入 store.fiscalYear（後端必填，FE 端 optional 待接線）
  fiscalYear?: number;
  groups: ChildGroupBudgetItemPayload[];
}

export const usePostChildGroupBudget = (
  options?: UseMutationOptions<AxiosResponse, AxiosError, ChildGroupBudgetPayload>
) => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/budget', 'child_groups', 'create'],
    mutationFn: async (payload: ChildGroupBudgetPayload) => {
      const response = await axiosInstance().post(`/budget/child_groups/`, payload, { headers });
      return response;
    },
    ...options,
  });
};
