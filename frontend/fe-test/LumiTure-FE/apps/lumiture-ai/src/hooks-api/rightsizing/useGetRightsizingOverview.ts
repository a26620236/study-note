import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RightsizingOverview } from './rightsizing.type';

type RightsizingOverviewResponse = ResponseGenerics<RightsizingOverview>;

export const rightsizingOverviewQueryKey = ['/rightsizing', 'overview'];

export const rightsizingOverviewQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<RightsizingOverviewResponse>(
    '/rightsizing/recommend/overview',
    {
      headers,
    }
  );
  return res.data;
};

export const useGetRightsizingOverview = (
  options?: UseQueryOptions<RightsizingOverviewResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<RightsizingOverviewResponse>({
    queryKey: rightsizingOverviewQueryKey,
    queryFn: async () => await rightsizingOverviewQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
