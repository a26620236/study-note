import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LumiTagPreviewOverview, LumiTagScope } from './lumiTag.type';

export interface LumiTagPreviewOverviewPayload {
  name: string;
  values: {
    id?: number;
    name: string;
    displayOrder: number;
    scopes: LumiTagScope[];
  }[];
}

type LumiTagPreviewOverviewRes = ResponseGenerics<LumiTagPreviewOverview>;

export const lumiTagPreviewOverviewQueryKey = (payload: LumiTagPreviewOverviewPayload) => [
  'lumitag',
  'preview',
  'overview',
  payload,
];

export const lumiTagPreviewOverviewQueryFn = async (
  headers: RawAxiosRequestHeaders,
  payload: LumiTagPreviewOverviewPayload
) => {
  const res = await axiosInstance().post<LumiTagPreviewOverviewRes>(
    '/lumitag/preview/overview',
    payload,
    { headers }
  );
  return res.data;
};

export const useGetLumiTagPreviewOverview = (
  payload: LumiTagPreviewOverviewPayload,
  options?: Omit<UseQueryOptions<LumiTagPreviewOverviewRes>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<LumiTagPreviewOverviewRes>({
    queryKey: lumiTagPreviewOverviewQueryKey(payload),
    queryFn: async () => await lumiTagPreviewOverviewQueryFn(headers, payload),
    enabled: hasToken,
    ...options,
  });
};
