import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RightsizingResource } from './rightsizing.type';

type RightsizingResourceResponse = ResponseGenerics<RightsizingResource>;

interface RightsizingAvailableResourcesPayload {
  scopeId?: string;
  groupIds?: string[];
}

export const getRightsizingAvailableResourcesQueryKey = (scopeId?: string, groupIds?: string[]) => [
  'rightsizing',
  'available',
  'resources',
  scopeId,
  groupIds,
];

export const rightsizingAvailableResourcesQueryFn = async (
  { groupIds, scopeId }: RightsizingAvailableResourcesPayload,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().post<RightsizingResourceResponse>(
    '/rightsizing/settings/available-resources',
    { groupIds, scopeId },
    { headers }
  );
  return res.data;
};

export const useGetRightsizingAvailableResources = (scopeId?: string, groupIds?: string[]) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<RightsizingResourceResponse>({
    queryKey: getRightsizingAvailableResourcesQueryKey(scopeId, groupIds),
    queryFn: async () => await rightsizingAvailableResourcesQueryFn({ groupIds, scopeId }, headers),
    enabled: hasToken && !!groupIds?.length && !!scopeId,
  });
};
