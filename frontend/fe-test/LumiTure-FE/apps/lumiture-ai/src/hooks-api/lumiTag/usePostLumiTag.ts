import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTagScope, LumiTagStatus } from './lumiTag.type';

interface PostLumiTagValue {
  id?: number;
  name: string;
  displayOrder: number;
  scopes: LumiTagScope[];
}

export interface PostLumiTagPayload {
  name: string;
  status: LumiTagStatus;
  values: PostLumiTagValue[];
}

export type PostLumiTagResponse = ResponseGenerics;

export const usePostLumiTag = (
  options?: UseMutationOptions<PostLumiTagResponse, AxiosError, PostLumiTagPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/lumitag/', 'create'],
    mutationFn: async (payload: PostLumiTagPayload) => {
      const res = await axiosInstance().post<PostLumiTagResponse>('/lumitag/', payload, {
        headers,
      });
      return res.data;
    },
    ...options,
  });
};
