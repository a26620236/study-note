import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GCPAssignedResources } from './resources.type';

type GCPAssignedResourcesResponse = ResponseGenerics<GCPAssignedResources>;

export const gcpAssignedResourcesQueryKey = (groupId: string) => [
  'resources',
  'assigned',
  'gcp',
  groupId,
];

export const gcpAssignedResourcesQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<GCPAssignedResourcesResponse>(
    `/platforms/gcp/resources/assigned`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetGCPAssignedResources = (
  groupId: string,
  options?: Omit<UseQueryOptions<GCPAssignedResourcesResponse>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  const { enabled: enabledOptions = true, ...restOptions } = options ?? {};
  return useQuery<GCPAssignedResourcesResponse>({
    queryKey: gcpAssignedResourcesQueryKey(groupId),
    queryFn: async () => await gcpAssignedResourcesQueryFn(groupId, headers),
    enabled: !!groupId && hasToken && enabledOptions,
    ...restOptions,
  });
};
