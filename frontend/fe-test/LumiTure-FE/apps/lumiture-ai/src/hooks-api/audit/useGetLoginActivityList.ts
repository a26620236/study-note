import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError, RawAxiosRequestHeaders } from 'axios';

import type { ResponseListGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { LoginActivityItem, Ordering, Provider } from './audit.type';

export interface LoginActivityListPayload {
  emails: string[];
  providers: Provider[];
  countries: string[];
  startDate: string;
  endDate: string;
  ordering: Ordering;
  search: string;
  page: number;
}

export type LoginActivityListResponse = ResponseListGenerics<LoginActivityItem[]>;

export const loginActivityListQueryKey = (payload: Omit<LoginActivityListPayload, 'page'>) => [
  'audit',
  'login-log',
  'list',
  payload,
];

export const loginActivityListQueryFn = async (
  headers: RawAxiosRequestHeaders,
  payload: LoginActivityListPayload
): Promise<LoginActivityListResponse> => {
  const res = await axiosInstance().post<LoginActivityListResponse>(
    '/audit/login-log/list',
    payload,
    { headers }
  );
  return res.data;
};

type LoginActivityListOptions = Omit<
  UseInfiniteQueryOptions<
    LoginActivityListResponse,
    AxiosError,
    InfiniteData<LoginActivityListResponse>,
    QueryKey,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export const useGetLoginActivityList = (
  payload: Omit<LoginActivityListPayload, 'page'>,
  options?: LoginActivityListOptions
) => {
  const { headers, hasToken } = useAuthHeaders();
  const { enabled, ...restOptions } = options ?? {};
  return useInfiniteQuery<
    LoginActivityListResponse,
    AxiosError,
    InfiniteData<LoginActivityListResponse>,
    QueryKey,
    number
  >({
    queryKey: loginActivityListQueryKey(payload),
    queryFn: async ({ pageParam }) =>
      await loginActivityListQueryFn(headers, { ...payload, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: hasToken && (enabled ?? true),
    ...restOptions,
  });
};
