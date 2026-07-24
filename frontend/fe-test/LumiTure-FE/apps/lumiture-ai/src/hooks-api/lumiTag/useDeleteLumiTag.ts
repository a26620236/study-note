import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

export type DeleteLumiTagResponse = ResponseGenerics;

export const useDeleteLumiTag = (
  options?: UseMutationOptions<DeleteLumiTagResponse, AxiosError, number>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/lumitag/', 'delete'],
    mutationFn: async (id: number) => {
      const res = await axiosInstance().delete<DeleteLumiTagResponse>(`/lumitag/${id}/`, {
        headers,
      });
      return res.data;
    },
    ...options,
  });
};
