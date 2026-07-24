import { useParams } from 'next/navigation';

import { useGetAzureAssignedResources, type AzureAssignedResourcesInfos } from '@hooks-api';

import type { GroupParams } from '../types/params';
import { usePlatformResources } from './usePlatformResources';

export const useAzureAssignedResourceData = () => {
  const params = useParams<GroupParams>();
  const groupId = params.tierTwoGroupId ?? params.tierOneGroupId;

  const searchText = usePlatformResources((state) => state.azure.searchText);

  const { data: azureAssignResourceData, isLoading } = useGetAzureAssignedResources(groupId);

  const azureResourceData = azureAssignResourceData?.data.resources ?? [];

  const filteredAzureResourceData = azureResourceData.filter((item) =>
    searchResourceMatch(searchText, item)
  );

  return {
    groupId,
    azureAvailableActions: azureAssignResourceData?.data.availableActions,
    azureAssignedResourceData: filteredAzureResourceData,
    isLoading,
  };
};

const searchResourceMatch = (searchText: string, item: AzureAssignedResourcesInfos) => {
  const searchLower = searchText.toLowerCase();

  const resourceGroupNameMatch = item.resourceGroupName.toLowerCase().includes(searchLower);
  const resourceGroupIdMatch = item.resourceGroupId.toLowerCase().includes(searchLower);
  const resourceGroupMatch = resourceGroupNameMatch || resourceGroupIdMatch;

  const subscriptionNameMatch = item.subscriptionName.toLowerCase().includes(searchLower);
  const subscriptionIdMatch = item.subscriptionId.toLowerCase().includes(searchLower);
  const subscriptionMatch = subscriptionNameMatch || subscriptionIdMatch;

  return resourceGroupMatch || subscriptionMatch;
};
