import { useParams } from 'next/navigation';

import { useGetGCPAssignedResources, type GCPAssignedResourcesInfos } from '@hooks-api';

import type { GroupParams } from '../types/params';
import { usePlatformResources } from './usePlatformResources';

export const useGCPAssignedResourceData = () => {
  const params = useParams<GroupParams>();
  const groupId = params.tierTwoGroupId ?? params.tierOneGroupId;

  const searchText = usePlatformResources((state) => state.gcp.searchText);

  const { data: gcpAssignResourceData, isLoading } = useGetGCPAssignedResources(groupId);

  const gcpResourceData = gcpAssignResourceData?.data.resources ?? [];

  const filteredGcpResourceData = gcpResourceData.filter((item) =>
    searchResourceMatch(searchText, item)
  );

  return {
    groupId,
    gcpAvailableActions: gcpAssignResourceData?.data.availableActions,
    gcpAssignedResourceData: filteredGcpResourceData,
    isLoading,
  };
};

const searchResourceMatch = (searchText: string, item: GCPAssignedResourcesInfos) => {
  const searchLower = searchText.toLowerCase();

  const projectNameMatch = item.projectName.toLowerCase().includes(searchLower);
  const projectIdMatch = item.projectId.toLowerCase().includes(searchLower);
  const projectMatch = projectNameMatch || projectIdMatch;

  const billingAccountNameMatch = item.billingAccountName.toLowerCase().includes(searchLower);
  const billingAccountIdMatch = item.billingAccountId.toLowerCase().includes(searchLower);
  const billingAccountMatch = billingAccountNameMatch || billingAccountIdMatch;

  return projectMatch || billingAccountMatch;
};
