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

import type { DomainType, Ordering, UserActivityItem } from './audit.type';

export interface UserActivityListPayload {
  emails: string[];
  domainTypes: DomainType[];
  countries: string[];
  startDate: string | null;
  endDate: string | null;
  ordering: Ordering;
  search: string;
  page: number;
}

export type UserActivityListResponse = ResponseListGenerics<UserActivityItem[]>;

export const userActivityListQueryKey = (payload: Omit<UserActivityListPayload, 'page'>) => [
  'audit',
  'activity-log',
  'list',
  payload,
];

export const userActivityListQueryFn = async (
  headers: RawAxiosRequestHeaders,
  payload: UserActivityListPayload
): Promise<UserActivityListResponse> => {
  const res = await axiosInstance().post<UserActivityListResponse>(
    '/audit/activity-log/list',
    payload,
    { headers }
  );
  return res.data;
};

type UserActivityListOptions = Omit<
  UseInfiniteQueryOptions<
    UserActivityListResponse,
    AxiosError,
    InfiniteData<UserActivityListResponse>,
    QueryKey,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export const useGetUserActivityList = (
  payload: Omit<UserActivityListPayload, 'page'>,
  options?: UserActivityListOptions
) => {
  const { headers, hasToken } = useAuthHeaders();
  const { enabled, ...restOptions } = options ?? {};
  return useInfiniteQuery<
    UserActivityListResponse,
    AxiosError,
    InfiniteData<UserActivityListResponse>,
    QueryKey,
    number
  >({
    queryKey: userActivityListQueryKey(payload),
    queryFn: async ({ pageParam }) =>
      await userActivityListQueryFn(headers, { ...payload, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: hasToken && (enabled ?? true),
    ...restOptions,
  });
};
