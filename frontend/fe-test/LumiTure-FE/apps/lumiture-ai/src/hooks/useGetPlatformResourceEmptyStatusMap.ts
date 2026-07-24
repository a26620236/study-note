import { useSession } from 'next-auth/react';

import { PlatformsValue } from '@constants';
import {
  useGetAWSAssignedResources,
  useGetAzureAssignedResources,
  useGetGCPAssignedResources,
  type AWSAssignedResources,
  type AzureAssignedResources,
  type GCPAssignedResources,
} from '@hooks-api';

type PlatformResourcesData = GCPAssignedResources | AWSAssignedResources | AzureAssignedResources;

const checkIsResourcesEmpty = (queryResult?: PlatformResourcesData) => {
  if (!queryResult?.resources.length) return true;
  if (Array.isArray(queryResult.resources)) {
    return queryResult.resources.length === 0;
  }
  return false;
};

export const useGetPlatformResourceEmptyStatusMap = () => {
  const { data: session } = useSession();
  const groupId = String(session?.user.group?.groupId || '');

  const { data: GcpResourcesQuery, isLoading: isLoadingGcpResources } =
    useGetGCPAssignedResources(groupId);
  const { data: AwsResourcesQuery, isLoading: isLoadingAwsResources } =
    useGetAWSAssignedResources(groupId);
  const { data: AzureResourcesQuery, isLoading: isLoadingAzureResources } =
    useGetAzureAssignedResources(groupId);

  const GcpResources = GcpResourcesQuery?.data;
  const AwsResources = AwsResourcesQuery?.data;
  const AzureResources = AzureResourcesQuery?.data;

  const isLoading =
    !groupId || isLoadingGcpResources || isLoadingAwsResources || isLoadingAzureResources;

  const platformResourceEmptyStatusMap = {
    [PlatformsValue.GCP]: checkIsResourcesEmpty(GcpResources),
    [PlatformsValue.AWS]: checkIsResourcesEmpty(AwsResources),
    [PlatformsValue.AZURE]: checkIsResourcesEmpty(AzureResources),
  };

  return {
    isLoading,
    platformResourceEmptyStatusMap,
  };
};
