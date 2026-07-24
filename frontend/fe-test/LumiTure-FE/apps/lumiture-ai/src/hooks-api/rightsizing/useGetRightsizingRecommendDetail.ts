import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RecommendationItem, RightsizingRecommendDetail } from './rightsizing.type';

type RightsizingRecommendDetailResponse = ResponseGenerics<RightsizingRecommendDetail>;

export const rightsizingRecommendDetailQueryKey = (recId: RecommendationItem['recId']) => [
  '/rightsizing',
  'recommend',
  'detail',
  recId,
];

export const rightsizingRecommendDetailQueryFn = async (
  recId: RecommendationItem['recId'],
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<RightsizingRecommendDetailResponse>(
    `/rightsizing/recommend/detail?recId=${recId}`,
    {
      headers,
    }
  );
  return res.data;
};

export const useGetRightsizingRecommendDetail = (
  recId: RecommendationItem['recId'],
  options?: UseQueryOptions<RightsizingRecommendDetailResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<RightsizingRecommendDetailResponse>({
    queryKey: rightsizingRecommendDetailQueryKey(recId),
    queryFn: async () => await rightsizingRecommendDetailQueryFn(recId, headers),
    enabled: hasToken,
    ...options,
  });
};
