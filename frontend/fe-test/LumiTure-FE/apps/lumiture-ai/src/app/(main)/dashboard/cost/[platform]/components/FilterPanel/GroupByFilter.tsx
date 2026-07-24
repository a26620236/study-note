import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Typography } from '@mui/material';

import {
  GROUPED_SINGLE_SELECT_UNGROUPED_KEY,
  GroupedSingleSelect,
  Icon,
  SquareChip,
  type GroupedSingleSelectChangeEvent,
  type GroupedSingleSelectData,
  type GroupedSingleSelectGroup,
} from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';

import { PlatformsValue } from '@constants';
import {
  useGetPlatformFilterOptions,
  type AWSFilterOptions,
  type AzureFilterOptions,
  type GCPFilterOptions,
} from '@hooks-api';

import {
  awsUngroupedOptions,
  azureUngroupedOptions,
  gcpUngroupedOptions,
  GROUP_KEY,
  GROUP_LABELS,
  type GroupByValue,
} from '../../constants/groupByOptions';
import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { toAwsGroupBy, toAzureGroupBy, toGcpGroupBy } from '../../utils/toGroupBySelection';

type PlatformFilterOptions = GCPFilterOptions | AWSFilterOptions | AzureFilterOptions;

const TAG_CHIP_STYLE = {
  backgroundColor: basicColor.secondary.turquoiseBlue[70],
  color: theme.palette.white.main,
  '& .MuiChip-icon': {
    color: theme.palette.white.main,
  },
};

const labelChip = (
  <SquareChip
    label={<Typography variant="caption">{GROUP_LABELS.label}</Typography>}
    sx={TAG_CHIP_STYLE}
    variant="filled"
    size="small"
  />
);

const tagChip = (
  <SquareChip
    label={<Typography variant="caption">{GROUP_LABELS.tag}</Typography>}
    sx={TAG_CHIP_STYLE}
    variant="filled"
    size="small"
  />
);

const lumitagChip = (
  <SquareChip
    icon={<Icon name="sell" sx={{ color: theme.palette.white.main }} />}
    label={<Typography variant="caption">{GROUP_LABELS.lumitag}</Typography>}
    sx={TAG_CHIP_STYLE}
    variant="filled"
    size="small"
  />
);

const buildLumiTagGroup = (
  filterOptions?: PlatformFilterOptions
): GroupedSingleSelectGroup<GroupByValue> => ({
  key: GROUP_KEY.lumitag,
  displayKey: GROUP_LABELS.lumitag,
  values: (filterOptions?.lumitag.keys ?? []).map((key) => ({
    id: key.id,
    name: key.name,
    tags: [lumitagChip],
  })),
});

// 合併靜態 enum 選項與 API 動態 key（lumitag + label/tag）
const buildGroupByData = (
  platform: PlatformsValue,
  filterOptions?: PlatformFilterOptions
): GroupedSingleSelectData<GroupByValue> => {
  if (platform === PlatformsValue.GCP) {
    const labels = filterOptions && 'labels' in filterOptions ? filterOptions.labels : [];
    return [
      { key: GROUPED_SINGLE_SELECT_UNGROUPED_KEY, values: gcpUngroupedOptions },
      buildLumiTagGroup(filterOptions),
      {
        key: GROUP_KEY.label,
        displayKey: GROUP_LABELS.label,
        values: labels.map((label) => ({
          id: label.key,
          name: label.key,
          tags: [labelChip],
        })),
      },
    ];
  }

  if (platform === PlatformsValue.AWS) {
    const tags = filterOptions && 'tags' in filterOptions ? filterOptions.tags : [];
    return [
      { key: GROUPED_SINGLE_SELECT_UNGROUPED_KEY, values: awsUngroupedOptions },
      buildLumiTagGroup(filterOptions),
      {
        key: GROUP_KEY.tag,
        displayKey: GROUP_LABELS.tag,
        values: tags.map((tag) => ({ id: tag.key, name: tag.key, tags: [tagChip] })),
      },
    ];
  }

  const tags = filterOptions && 'tags' in filterOptions ? filterOptions.tags : [];
  return [
    { key: GROUPED_SINGLE_SELECT_UNGROUPED_KEY, values: azureUngroupedOptions },
    buildLumiTagGroup(filterOptions),
    {
      key: GROUP_KEY.tag,
      displayKey: GROUP_LABELS.tag,
      values: tags.map((tag) => ({ id: tag.key, name: tag.key, tags: [tagChip] })),
    },
  ];
};

export function GroupByFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { groupBy, startDate, endDate } = platformAllFilters;

  const { data: filterOptions, isLoading } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const groupByData = useMemo(
    () => buildGroupByData(platform, filterOptions?.data),
    [platform, filterOptions]
  );

  // group by 分兩類：
  // 1. 動態 key（lumitag / label / tag）：需指定是「哪一個」tag，下拉顯示該 key 字串
  // 2. 內建維度（Organization / Service / Sku 等固定選項）：key 為 null，下拉顯示維度 enum
  const selectedValue: GroupByValue = groupBy.key ?? groupBy.type;

  const handleGroupByChange = ({ group, value }: GroupedSingleSelectChangeEvent<GroupByValue>) => {
    if (value === null) return;

    if (platform === PlatformsValue.GCP) {
      handleSetFilter(platform, { groupBy: toGcpGroupBy(group, value) });
      return;
    }
    if (platform === PlatformsValue.AWS) {
      handleSetFilter(platform, { groupBy: toAwsGroupBy(group, value) });
      return;
    }
    handleSetFilter(platform, { groupBy: toAzureGroupBy(group, value) });
  };

  return (
    <GroupedSingleSelect
      dataTestId={`${platform}-group-by-filter`}
      configKey="GroupBy"
      label="Group By"
      data={groupByData}
      value={selectedValue}
      isLoading={isLoading}
      onChange={handleGroupByChange}
    />
  );
}
