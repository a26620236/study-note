import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GCPAvailableResources } from './resources.type';

type GCPAvailableResourcesResponse = ResponseGenerics<GCPAvailableResources>;

export const gcpAvailableResourcesQueryKey = (groupId: string) => [
  'gcp',
  'resources',
  'available',
  groupId,
];

export const gcpAvailableResourcesQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<GCPAvailableResourcesResponse>(
    `/platforms/gcp/resources/available`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetGCPAvailableResources = (groupId: string) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<GCPAvailableResourcesResponse>({
    queryKey: gcpAvailableResourcesQueryKey(groupId),
    queryFn: async () => await gcpAvailableResourcesQueryFn(groupId, headers),
    enabled: !!groupId && hasToken,
  });
};
