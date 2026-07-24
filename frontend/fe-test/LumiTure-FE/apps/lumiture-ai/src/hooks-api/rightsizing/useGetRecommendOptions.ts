import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RightsizingOptions } from './rightsizing.type';

type RecommendOptionsResponse = ResponseGenerics<RightsizingOptions>;

export const recommendOptionsQueryKey = () => ['/rightsizing', 'recommend', 'options'];

export const recommendOptionsQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<RecommendOptionsResponse>(
    '/rightsizing/recommend/options',
    {
      headers,
    }
  );
  return res.data;
};

export const useGetRecommendOptions = () => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<RecommendOptionsResponse>({
    queryKey: recommendOptionsQueryKey(),
    queryFn: async () => await recommendOptionsQueryFn(headers),
    enabled: hasToken,
  });
};
