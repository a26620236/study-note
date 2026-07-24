import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import type { PlatformValueWithFOCUS } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTagPreviewDetail, LumiTagScope, PreviewDetailType } from './lumiTag.type';

export interface LumiTagPreviewDetailPayload {
  selectionDisplayOrder: number;
  groupBy: PreviewDetailType;
  platform: PlatformValueWithFOCUS;
  values: {
    name: string;
    displayOrder: number;
    scopes: LumiTagScope[];
  }[];
}

type LumiTagPreviewDetailRes = ResponseGenerics<LumiTagPreviewDetail>;

export const lumiTagPreviewDetailQueryKey = (payload: LumiTagPreviewDetailPayload) => [
  'lumitag',
  'preview',
  'detail',
  payload,
];

export const lumiTagPreviewDetailQueryFn = async (
  headers: RawAxiosRequestHeaders,
  payload: LumiTagPreviewDetailPayload
) => {
  const res = await axiosInstance().post<LumiTagPreviewDetailRes>(
    '/lumitag/preview/detail',
    payload,
    { headers }
  );
  return res.data;
};

export const useGetLumiTagPreviewDetail = (
  payload: LumiTagPreviewDetailPayload,
  options?: Omit<UseQueryOptions<LumiTagPreviewDetailRes>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<LumiTagPreviewDetailRes>({
    queryKey: lumiTagPreviewDetailQueryKey(payload),
    queryFn: async () => await lumiTagPreviewDetailQueryFn(headers, payload),
    enabled: hasToken,
    ...options,
  });
};
