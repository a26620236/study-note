import { useMemo } from 'react';

import { useGetRightsizingRecommend, type RecommendationItem } from '@hooks-api';

import { useRightsizingStore } from './useRightsizingStore';

// Hook to get filtered table data
export const useRightsizingData = () => {
  const { selectedStatus, selectedAssignToGroups, selectedProviders, searchText } =
    useRightsizingStore();
  const {
    data: rightsizingRecommend,
    isFetching,
    isLoading,
  } = useGetRightsizingRecommend(selectedStatus);

  const rawTableData = useMemo(
    () => rightsizingRecommend?.data.items ?? [],
    [rightsizingRecommend]
  );

  // 篩選邏輯
  const filteredData = useMemo(
    () =>
      rawTableData.filter((item) => {
        // assignTo 群組篩選
        const hasGroupFilter = selectedAssignToGroups.length > 0;
        const itemMatchesGroup =
          item.assignTo?.some((group) => selectedAssignToGroups.includes(group)) ?? false;
        if (hasGroupFilter && !itemMatchesGroup) return false;

        // provider 篩選
        const hasProviderFilter = selectedProviders.length > 0;
        const itemMatchesProvider = selectedProviders.includes(item.configurationItem.provider);
        if (hasProviderFilter && !itemMatchesProvider) return false;

        // 文字搜尋篩選
        if (!searchTextMatch(searchText, item)) return false;

        return true;
      }),
    [rawTableData, searchText, selectedAssignToGroups, selectedProviders]
  );

  return {
    rawTableData,
    filteredData,
    isLoading,
    isFetching,
  };
};

const searchTextMatch = (searchText: string, item: RecommendationItem) => {
  const searchLower: string = searchText.toLowerCase();

  const configurationItemNameMatch =
    item.configurationItem.name?.toLowerCase().includes(searchLower) ?? false;
  const configurationItemIdMatch = item.configurationItem.id.toLowerCase().includes(searchLower);
  const configurationItemMatch = configurationItemNameMatch || configurationItemIdMatch;

  const resourceNameMatch = item.resource.name.toLowerCase().includes(searchLower);
  const resourceIdMatch = item.resource.id.toLowerCase().includes(searchLower);
  const resourceMatch = resourceNameMatch || resourceIdMatch;

  const tagMatch =
    item.resourceTag?.some((tag) => tag.toLowerCase().includes(searchLower)) ?? false;

  return configurationItemMatch || resourceMatch || tagMatch;
};
