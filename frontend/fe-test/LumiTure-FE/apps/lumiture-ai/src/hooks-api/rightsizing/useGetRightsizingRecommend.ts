import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RecommendStatus, RightsizingList } from './rightsizing.type';

type RightsizingRecommendResponse = ResponseGenerics<RightsizingList>;

export const rightsizingRecommendBaseQueryKey = ['/rightsizing', 'recommend', 'list'];

export const rightsizingRecommendQueryKey = (status: RecommendStatus) => [
  ...rightsizingRecommendBaseQueryKey,
  status,
];

export const rightsizingRecommendQueryFn = async (
  headers: RawAxiosRequestHeaders,
  status: RecommendStatus
) => {
  const res = await axiosInstance().get<RightsizingRecommendResponse>(
    '/rightsizing/recommend/list',
    {
      params: {
        status,
      },
      headers,
    }
  );
  return res.data;
};

export const useGetRightsizingRecommend = (
  status: RecommendStatus,
  options?: UseQueryOptions<RightsizingRecommendResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<RightsizingRecommendResponse>({
    queryKey: rightsizingRecommendQueryKey(status),
    queryFn: async () => await rightsizingRecommendQueryFn(headers, status),
    enabled: hasToken,
    ...options,
  });
};
