import type { BarSeriesOption } from 'echarts';

import { palette } from '@lumiture-ui/theme';

import { TOTAL_BUDGET_LABEL } from '@app/(main)/components/optimize-cloud-spend/constants';
import type { SpendingGroupData } from '@app/(main)/components/optimize-cloud-spend/utils/transformGroupData';
import { AWS, AZURE, GCP, PLATFORM_CONFIG } from '@constants';

const hasData = (dataset: unknown) =>
  Array.isArray(dataset) && dataset.some((data) => typeof data === 'number');

// getNumericValue 的防禦性分支在 generateSortedSeries 的呼叫路徑中皆不可達：
// - null / undefined 分支：data items 在 forEach 中已包裝為 { value, isOverrun } 物件
// - raw number 分支：budget series 在計算 sum 前已被 costSeries.filter 排除
/* v8 ignore start */
const getNumericValue = (dataPoint: unknown): number => {
  if (dataPoint === null || dataPoint === undefined) return 0;
  if (typeof dataPoint === 'object' && 'value' in dataPoint) {
    return Number(dataPoint.value) || 0;
  }
  return Number(dataPoint) || 0;
};
/* v8 ignore stop */

export const generateSortedSeries = (
  groupData: SpendingGroupData,
  order: 'asc' | 'desc' = 'desc'
) => {
  const platforms = [
    { key: 'gcp', color: GCP.color },
    { key: 'aws', color: AWS.color },
    { key: 'azure', color: AZURE.color },
  ] as const;

  const series: BarSeriesOption[] = [];

  platforms.forEach(({ key, color }) => {
    const costs = groupData[`${key}Cost`];
    const budgets = groupData[`${key}Budget`];

    if (hasData(costs)) {
      series.push({
        name: PLATFORM_CONFIG[key].label,
        type: 'bar',
        stack: 'cost',
        data: costs.map((cost, i) => {
          const budget = budgets[i];
          return {
            value: cost ?? 0,
            isOverrun: typeof budget === 'number' && typeof cost === 'number' && budget < cost,
          };
        }),
        itemStyle: { color },
      });
    }
  });

  if (hasData(groupData.budget)) {
    series.push({
      name: TOTAL_BUDGET_LABEL,
      type: 'bar',
      stack: 'budget',
      data: groupData.budget,
      itemStyle: { color: palette.colorKit.main[5] },
    });
  }

  if (!series.length || !series[0].data?.length) {
    return { series, groupNames: groupData.groupName };
  }

  const costSeries = series.filter((s) => s.name !== TOTAL_BUDGET_LABEL);
  const totalByIndex = (series[0].data as unknown[]).map((_, index) => ({
    index,
    sum: costSeries.reduce((acc, s) => acc + getNumericValue(s.data?.[index]), 0),
  }));

  totalByIndex.sort((a, b) => (order === 'desc' ? b.sum - a.sum : a.sum - b.sum));

  return {
    series: series.map((_series) => ({
      ..._series,
      data: totalByIndex.map(({ index }) => _series.data?.[index]),
    })),
    groupNames: totalByIndex.map(({ index }) => groupData.groupName[index]),
  };
};
