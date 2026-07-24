import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { GroupedMultiSelect, type GroupData, type SelectedData } from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import { useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

const LABELS = {
  gcp: { label: 'Label', allDisplay: 'All Labels' },
  cloud: { label: 'Tag', allDisplay: 'All Tags' },
};

/**
 * Cloud Tag/Label 選擇器
 * - GCP: 使用 labels 欄位
 * - AWS / Azure: 使用 tags 欄位
 */
export function CloudTagFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate } = platformAllFilters;

  const { data: filterOptionsData } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const filterOptions = filterOptionsData?.data;

  const isGCPFilter = platform === PlatformsValue.GCP;
  const isAWSFilter = platform === PlatformsValue.AWS;
  const isAzureFilter = platform === PlatformsValue.AZURE;

  // 取得目前平台已選的 labels/tags（shape 與 SelectedData 相同）
  const selectedTags = useMemo<SelectedData>(() => {
    if (isGCPFilter && 'labels' in platformAllFilters) {
      return platformAllFilters.labels;
    }
    if ((isAWSFilter || isAzureFilter) && 'tags' in platformAllFilters) {
      return platformAllFilters.tags;
    }
    return [];
  }, [isGCPFilter, isAWSFilter, isAzureFilter, platformAllFilters]);

  const [tempSelectedTags, setTempSelectedTags] = useState<SelectedData>(selectedTags);

  useEffect(() => {
    setTempSelectedTags(selectedTags);
  }, [selectedTags]);

  const tagOptions = useMemo<GroupData>(() => {
    if (!filterOptions) return [];

    let rawOptions: { key: string; values: string[] }[] = [];

    if (isGCPFilter && 'labels' in filterOptions) {
      rawOptions = filterOptions.labels;
    } else if ((isAWSFilter || isAzureFilter) && 'tags' in filterOptions) {
      rawOptions = filterOptions.tags;
    }

    return rawOptions.map((option) => ({
      key: option.key,
      displayKey: option.key,
      values: option.values.map((value) => ({ id: value, name: value })),
    }));
  }, [filterOptions, isGCPFilter, isAWSFilter, isAzureFilter]);

  const text = isGCPFilter ? LABELS.gcp : LABELS.cloud;

  const handleChange = (newSelectedTags: SelectedData) => {
    setTempSelectedTags(newSelectedTags);
  };

  const handleClose = () => {
    if (isGCPFilter) {
      handleSetFilter(platform, { labels: tempSelectedTags });
    } else {
      handleSetFilter(platform, { tags: tempSelectedTags });
    }
  };

  return (
    <GroupedMultiSelect
      dataTestId={`${platform}-cloud-tag-filter`}
      label={text.label}
      defaultDisplayValue={text.allDisplay}
      selectPlaceholder={text.allDisplay}
      data={tagOptions}
      value={tempSelectedTags}
      onChange={handleChange}
      handleClose={handleClose}
      defaultExpanded={false}
    />
  );
}
