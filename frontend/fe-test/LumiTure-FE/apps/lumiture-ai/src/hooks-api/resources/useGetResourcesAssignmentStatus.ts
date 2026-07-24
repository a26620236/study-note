import { useQuery } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';
import { useSession } from 'next-auth/react';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { ResourcesAssignmentStatus } from './resources.type';

type ResourcesAssignmentStatusResponse = ResponseGenerics<ResourcesAssignmentStatus>;

export const resourcesAssignmentStatusQueryKey = (groupId?: string) => [
  'platforms',
  'resources',
  'assignment-status',
  groupId,
];

export const resourcesAssignmentStatusQueryFn = async (
  groupId: string,
  headers: RawAxiosRequestHeaders
) => {
  const res = await axiosInstance().get<ResourcesAssignmentStatusResponse>(
    `/platforms/resources/assignment-status`,
    { params: { groupId }, headers }
  );
  return res.data;
};

export const useGetResourcesAssignmentStatus = () => {
  const { headers, hasToken } = useAuthHeaders();
  const { data: session } = useSession();
  const groupId = String(session?.user.group?.groupId ?? '');

  return useQuery<ResourcesAssignmentStatusResponse>({
    queryKey: resourcesAssignmentStatusQueryKey(groupId),
    queryFn: async () => await resourcesAssignmentStatusQueryFn(groupId, headers),
    enabled: !!groupId && hasToken,
    staleTime: 1000 * 60 * 60,
  });
};
