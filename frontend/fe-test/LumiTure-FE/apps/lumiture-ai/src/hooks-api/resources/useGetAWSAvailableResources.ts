import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSAvailableResources } from './resources.type';

type AWSAvailableResourcesResponse = ResponseGenerics<AWSAvailableResources>;

export const awsAvailableResourcesQueryKey = (groupId: string) => [
  'aws',
  'resources',
  'available',
  groupId,
];

export const awsAvailableResourcesQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<AWSAvailableResourcesResponse>(
    `/platforms/aws/resources/available`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetAWSAvailableResources = (groupId: string) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AWSAvailableResourcesResponse>({
    queryKey: awsAvailableResourcesQueryKey(groupId),
    queryFn: async () => await awsAvailableResourcesQueryFn(groupId, headers),
    enabled: !!groupId && hasToken,
  });
};
