import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSAssignedResources } from './resources.type';

type AWSAssignedResourcesResponse = ResponseGenerics<AWSAssignedResources>;

export const awsAssignedResourcesQueryKey = (groupId: string) => [
  'aws',
  'resources',
  'assigned',
  groupId,
];

export const awsAssignedResourcesQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<AWSAssignedResourcesResponse>(
    `/platforms/aws/resources/assigned`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetAWSAssignedResources = (
  groupId: string,
  options?: Omit<UseQueryOptions<AWSAssignedResourcesResponse>, 'queryKey' | 'queryFn'>
) => {
  const { headers, hasToken } = useAuthHeaders();
  const { enabled: enabledOptions = true, ...restOptions } = options ?? {};
  return useQuery<AWSAssignedResourcesResponse>({
    queryKey: awsAssignedResourcesQueryKey(groupId),
    queryFn: async () => await awsAssignedResourcesQueryFn(groupId, headers),
    enabled: !!groupId && hasToken && enabledOptions,
    ...restOptions,
  });
};
