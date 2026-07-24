import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AzureAssignedResources } from './resources.type';

type AzureAssignedResourcesResponse = ResponseGenerics<AzureAssignedResources>;

export const azureAssignedResourcesQueryKey = (groupId: string) => [
  'azure',
  'resources',
  'assigned',
  groupId,
];

export const azureAssignedResourcesQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<AzureAssignedResourcesResponse>(
    `/platforms/azure/resources/assigned`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetAzureAssignedResources = (
  groupId: string,
  options?: Omit<UseQueryOptions<AzureAssignedResourcesResponse>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  const { enabled: enabledOptions = true, ...restOptions } = options ?? {};
  return useQuery<AzureAssignedResourcesResponse>({
    queryKey: azureAssignedResourcesQueryKey(groupId),
    queryFn: async () => await azureAssignedResourcesQueryFn(groupId, headers),
    enabled: !!groupId && hasToken && enabledOptions,
    ...restOptions,
  });
};
