import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTagScope, LumiTagStatus } from './lumiTag.type';

interface PutLumiTagValue {
  id?: number;
  name: string;
  displayOrder: number;
  scopes: LumiTagScope[];
}

export interface PutLumiTagPayload {
  name: string;
  status: LumiTagStatus;
  values: PutLumiTagValue[];
}

export type PutLumiTagResponse = ResponseGenerics;

interface PutLumiTagVariables {
  id: string;
  payload: PutLumiTagPayload;
}

export const usePutLumiTag = (
  options?: UseMutationOptions<PutLumiTagResponse, AxiosError, PutLumiTagVariables>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/lumitag/', 'update'],
    mutationFn: async ({ id, payload }: PutLumiTagVariables) => {
      const res = await axiosInstance().put<PutLumiTagResponse>(`/lumitag/${id}/`, payload, {
        headers,
      });
      return res.data;
    },
    ...options,
  });
};
