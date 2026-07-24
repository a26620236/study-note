import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AzureAvailableResources } from './resources.type';

type AzureAvailableResourcesResponse = ResponseGenerics<AzureAvailableResources>;

export const azureAvailableResourcesQueryKey = (groupId: string) => [
  'azure',
  'resources',
  'available',
  groupId,
];

export const azureAvailableResourcesQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<AzureAvailableResourcesResponse>(
    `/platforms/azure/resources/available`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetAzureAvailableResources = (groupId: string) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AzureAvailableResourcesResponse>({
    queryKey: azureAvailableResourcesQueryKey(groupId),
    queryFn: async () => await azureAvailableResourcesQueryFn(groupId, headers),
    enabled: !!groupId && hasToken,
  });
};
