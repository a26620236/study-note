import type { PlatformValueWithFOCUS } from '@constants';
import type { CostTrend } from '@hooks-api';

export interface CostDetailRow {
  id: string;
  name: string;
  totalCost: number;
  platform?: PlatformValueWithFOCUS;
  dailyCosts: Record<string, number>;
  isTotal?: boolean;
  isCredits?: boolean;
}

interface TransformParams {
  series: CostTrend['series'] | undefined;
  dateAxis: CostTrend['dateAxis'] | undefined;
}

/**
 * Transform cost trend series data into table rows for CostDetailTable
 * @param series - Array of cost series data
 * @param dateAxis - Array of date strings
 * @returns Array of transformed table rows
 */
export function transformCostTrendData({ series, dateAxis }: TransformParams): CostDetailRow[] {
  if (!series || !dateAxis) return [];

  const dataRows: CostDetailRow[] = series.map((item) => {
    const dailyCosts: Record<string, number> = {};
    dateAxis.forEach((date, index) => {
      dailyCosts[date] = item.data[index];
    });

    return {
      id: item.id || item.title,
      name: item.title,
      platform: item.platform,
      totalCost: item.totalCost,
      dailyCosts,
      isTotal: false,
    };
  });

  return dataRows;
}
