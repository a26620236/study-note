import type { CallbackDataParams } from 'echarts/types/dist/shared.js';

import type { CurrencySymbol, PlatformsValue } from '@constants';
import type { OverviewByCloud, SpendingGroup } from '@hooks-api';

/* ////////// HighestSpendingChart ////////// */
export interface HighestSpendingChartProps {
  sourceData: SpendingGroup[];
  platformBudget: Record<
    string,
    {
      budget: number | null;
    }
  >;
  isScreenshotMode?: boolean;
}

export interface ChartTooltipCallbackDataParamsMap {
  cloud: ChartTooltipCallbackDataParams[];
  total: ChartTooltipCallbackDataParams | null;
}

export interface HighestSpendingChartTooltipProps {
  totalCost: number;
  paramsMap: ChartTooltipCallbackDataParamsMap;
  currencySymbol: CurrencySymbol;
}

/* ////////// CostByCloudChart ////////// */
export interface CostByCloudTooltipParam {
  axisValueLabel?: string | number;
  value: number | string | null;
  seriesName: string;
  seriesId: string;
}

export interface CostByCloudChartProps {
  sourceData: OverviewByCloud['costByCloud'];
  isScreenshotMode?: boolean;
}

export interface ChartTooltipCallbackDataParams extends CallbackDataParams {
  axisValueLabel?: string | number;
}

export interface StyleItem {
  color: string;
  borderColor?: string;
  borderWidth?: number;
  borderType?: string;
}

export interface BarStyleSchema {
  label: string;
  itemStyle: StyleItem;
}

export interface CloudDatasetItem {
  value: number | null;
  itemStyle: StyleItem;
}

export type CloudDataset = Record<string, CloudDatasetItem[]>;

export type AcceptPlatforms = [PlatformsValue.AWS, PlatformsValue.GCP];
