import { useParams } from 'next/navigation';

import { useGetAWSAssignedResources, type AWSAssignedResourcesInfos } from '@hooks-api';

import type { GroupParams } from '../types/params';
import { usePlatformResources } from './usePlatformResources';

export const useAWSAssignedResourceData = () => {
  const params = useParams<GroupParams>();
  const groupId = params.tierTwoGroupId ?? params.tierOneGroupId;

  const searchText = usePlatformResources((state) => state.aws.searchText);

  const { data: awsAssignResourceData, isLoading } = useGetAWSAssignedResources(groupId);

  const awsResourceData = awsAssignResourceData?.data.resources ?? [];

  const filteredAwsResourceData = awsResourceData.filter((item) =>
    searchResourceMatch(searchText, item)
  );

  return {
    groupId,
    awsAvailableActions: awsAssignResourceData?.data.availableActions,
    awsAssignedResourceData: filteredAwsResourceData,
    isLoading,
  };
};

const searchResourceMatch = (searchText: string, item: AWSAssignedResourcesInfos) => {
  const searchLower = searchText.toLowerCase();

  const accountNameMatch = item.accountName.toLowerCase().includes(searchLower);
  const accountIdMatch = item.accountId.toLowerCase().includes(searchLower);
  const accountMatch = accountNameMatch || accountIdMatch;

  const managementAccountNameMatch = item.managementAccountName.toLowerCase().includes(searchLower);
  const managementAccountIdMatch = item.managementAccountId.toLowerCase().includes(searchLower);
  const managementAccountMatch = managementAccountNameMatch || managementAccountIdMatch;

  return accountMatch || managementAccountMatch;
};
