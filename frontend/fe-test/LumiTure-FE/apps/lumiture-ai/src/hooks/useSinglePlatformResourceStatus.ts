import { useSession } from 'next-auth/react';

import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import {
  useGetAWSAssignedResources,
  useGetAzureAssignedResources,
  useGetGCPAssignedResources,
  type AWSAssignedResources,
  type AzureAssignedResources,
  type GCPAssignedResources,
} from '@hooks-api';

const checkIsResourcesEmpty = (
  queryResult?: GCPAssignedResources | AWSAssignedResources | AzureAssignedResources
) => {
  if (!queryResult?.resources.length) return true;
  if (Array.isArray(queryResult.resources)) {
    return queryResult.resources.length === 0;
  }
  return false;
};

interface UseSinglePlatformResourceStatusProps {
  platform: PlatformValueWithFOCUS;
}

export const useSinglePlatformResourceStatus = ({
  platform,
}: UseSinglePlatformResourceStatusProps) => {
  const { data: session, status: sessionStatus } = useSession();
  const groupId = String(session?.user.group?.groupId || '');

  const gcpQuery = useGetGCPAssignedResources(groupId, {
    enabled: platform === PlatformsValue.GCP && !!groupId,
  });
  const awsQuery = useGetAWSAssignedResources(groupId, {
    enabled: platform === PlatformsValue.AWS && !!groupId,
  });
  const azureQuery = useGetAzureAssignedResources(groupId, {
    enabled: platform === PlatformsValue.AZURE && !!groupId,
  });

  if (platform === CrossCloudValue.FOCUS) {
    return {
      isLoading: false,
      isEmpty: false,
    };
  }

  const queryMap = {
    [PlatformsValue.GCP]: gcpQuery,
    [PlatformsValue.AWS]: awsQuery,
    [PlatformsValue.AZURE]: azureQuery,
  };

  const currentQuery = queryMap[platform];
  const data = currentQuery.data?.data;
  const isSessionLoading = sessionStatus === 'loading';
  const isLoading = isSessionLoading || !groupId || currentQuery.isLoading;

  return {
    isLoading,
    isEmpty: isLoading ? false : checkIsResourcesEmpty(data),
  };
};
