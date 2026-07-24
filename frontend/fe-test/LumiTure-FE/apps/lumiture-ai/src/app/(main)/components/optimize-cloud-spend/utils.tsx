import type { BarSeriesOption } from 'echarts';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';
import { renderToString } from 'react-dom/server';

import { palette } from '@lumiture-ui/theme';

import { TOTAL_BUDGET_LABEL } from '@app/(main)/components/optimize-cloud-spend/constants';
import Tooltip from '@app/(main)/components/optimize-cloud-spend/highestSpending/Tooltip';
import type { ChartTooltipCallbackDataParamsMap } from '@app/(main)/components/optimize-cloud-spend/types';
import type { SpendingGroupData } from '@app/(main)/components/optimize-cloud-spend/utils/transformGroupData';
import { AWS, GCP, PLATFORM_CONFIG, type CurrencySymbol, type PlatformsValue } from '@constants';

const BAR_STACK = {
  COST: 'cost',
  BUDGET: 'budget',
};

const isValidPlatform = (platform: string | undefined): platform is PlatformsValue => {
  if (typeof platform !== 'string') return false;
  const lowerPlatform = platform.toLowerCase();

  return Object.values(PLATFORM_CONFIG).some((_platform) => {
    // 因為 gcp 可能會叫 gcp 或者 google cloud 所以同時使用 label 和 value 檢查比較保險
    const checkKeys = ['label', 'abbr', 'value'] as const;
    return checkKeys.some((_key) => {
      const value = _platform[_key];
      return typeof value === 'string' && value.toLowerCase() === lowerPlatform;
    });
  });
};
export const generateGroupBySeriesName = (params: CallbackDataParams | CallbackDataParams[]) => {
  const tooltipParams = Array.isArray(params) ? params : [params];
  const groupBySeriesName = tooltipParams.reduce<ChartTooltipCallbackDataParamsMap>(
    (acc, curr) => {
      if (isValidPlatform(curr.seriesName)) {
        acc.cloud.push(curr);
      } else {
        acc.total = curr;
      }
      return acc;
    },
    { cloud: [], total: null }
  );
  return groupBySeriesName;
};

export const generateTotalCost = (params: CallbackDataParams | CallbackDataParams[]) => {
  const groupBySeriesName = generateGroupBySeriesName(params);

  const totalCost = groupBySeriesName.cloud.reduce<number>(
    (acc, curr) => acc + ('value' in curr && typeof curr.value === 'number' ? curr.value : 0),
    0
  );
  return totalCost;
};

export const createTooltipFormatter =
  (currencySymbol?: CurrencySymbol) => (params: CallbackDataParams | CallbackDataParams[]) => {
    const totalCost = generateTotalCost(params);
    const groupBySeriesName = generateGroupBySeriesName(params);
    return renderToString(
      <Tooltip
        totalCost={totalCost}
        paramsMap={groupBySeriesName}
        currencySymbol={currencySymbol || '$'}
      />
    );
  };

const hasData = (dataset: (string | number | null)[]) => {
  if (!Array.isArray(dataset)) return false;
  return dataset.some((data) => typeof data === 'number');
};

export const sortByTotalCost = (
  originalSeries: BarSeriesOption[],
  groupNames: string[],
  order: 'asc' | 'desc' = 'desc'
) => {
  // 如果資料為空或只有一個點，不需要排序
  if (!originalSeries.length || !originalSeries[0].data?.length) {
    return {
      series: originalSeries,
      groupNames,
    };
  }

  interface SumItem {
    index: number;
    sum: number;
  }

  // 過濾掉 name 為 'Total Budget' 的 data
  const filteredData = originalSeries.filter((series) => series.name !== TOTAL_BUDGET_LABEL);

  // 如果過濾後沒有數據，返回原始數據
  if (!filteredData.length) {
    return {
      series: originalSeries,
      groupNames,
    };
  }

  // 安全獲取數值
  const getNumericValue = (dataPoint: unknown): number => {
    if (dataPoint === undefined || dataPoint === null) {
      return 0;
    }
    if (typeof dataPoint === 'object' && 'value' in dataPoint) {
      return Number(dataPoint.value) || 0;
    }
    return Number(dataPoint) || 0;
  };

  // 計算每個位置的總和
  const totalByIndex: SumItem[] = [];
  for (let i = 0; i < (filteredData[0].data ?? []).length; i++) {
    let sum = 0;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let j = 0; j < filteredData.length; j++) {
      if (filteredData[j].data) {
        const dataPoint = filteredData[j]?.data?.[i];
        sum += getNumericValue(dataPoint);
      }
    }
    totalByIndex.push({ index: i, sum });
  }

  // 根據總和排序
  totalByIndex.sort((a, b) => (order === 'desc' ? b.sum - a.sum : a.sum - b.sum));

  // 按照排序結果重組資料
  const sortedSeries = originalSeries.map((_series) => {
    const newSeries = { ..._series };
    newSeries.data = totalByIndex.map((item) => _series.data?.[item.index]);
    return newSeries;
  });

  // 同時對分組名稱進行重新排序
  const sortedGroupNames = totalByIndex.map((item) => groupNames[item.index]);

  return {
    series: sortedSeries,
    groupNames: sortedGroupNames,
  };
};

export const generateSortedByTotalCostSeries = (
  groupData: SpendingGroupData,
  order: 'asc' | 'desc' = 'desc'
) => {
  const getPlatformData = (platform: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code -- legacy code
    const costKey = `${platform}Cost` as keyof SpendingGroupData;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code -- legacy code
    const budgetKey = `${platform}Budget` as keyof SpendingGroupData;

    const isOverrun = ({ budget, cost }: { budget?: number | null; cost: number | null }) => {
      if (typeof budget !== 'number' || typeof cost !== 'number') return false;
      return budget < cost;
    };

    type Cost = number;
    type Budget = number | null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unnecessary-condition -- legacy code
    return ((groupData[costKey] as Cost[]) || []).map((value, index) => ({
      value,
      isOverrun: isOverrun({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code -- legacy code
        budget: (groupData[budgetKey] as Budget[])[index],
        cost: value,
      }),
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const originalSeries = [
    hasData(groupData.gcpCost)
      ? {
          name: PLATFORM_CONFIG.gcp.label,
          type: 'bar',
          stack: BAR_STACK.COST,
          data: getPlatformData('gcp'),
          itemStyle: {
            color: GCP.color,
          },
        }
      : null,
    hasData(groupData.awsCost)
      ? {
          name: PLATFORM_CONFIG.aws.label,
          type: 'bar',
          stack: BAR_STACK.COST,
          data: getPlatformData('aws'),
          itemStyle: {
            color: AWS.color,
          },
        }
      : null,
    hasData(groupData.budget)
      ? {
          name: TOTAL_BUDGET_LABEL,
          type: 'bar',
          stack: BAR_STACK.BUDGET,
          data: groupData.budget,
          itemStyle: {
            color: palette.colorKit.main[5],
          },
        }
      : null,
  ].filter(Boolean) as BarSeriesOption[];

  return sortByTotalCost(originalSeries, groupData.groupName, order);
};
