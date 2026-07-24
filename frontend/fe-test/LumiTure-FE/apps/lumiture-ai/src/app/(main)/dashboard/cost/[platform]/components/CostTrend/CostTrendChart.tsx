import React, { useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';

import { alpha, Stack, useTheme } from '@mui/material';
import { format } from 'date-fns';
import type { BarSeriesOption, EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { palette } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import { CollapsibleLegends } from '@components/echart/CollapsibleLegends';
import {
  AWS,
  AZURE,
  COLOR_KIT,
  CrossCloudValue,
  GCP,
  PlatformsValue,
  type PlatformValueWithFOCUS,
} from '@constants';
import { FOCUSGroupBy, Granularity, type CostTrend } from '@hooks-api';

import { GCP_FOCUS_TOOLTIP } from '../../constants/focusTooltip';
import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { hasCreditsSelected } from '../../utils/hasCreditsSelected';
import { CostTrendChartTooltip } from './CostTrendChartTooltip';

const getCloudProviderLegendColor = (id?: string) => {
  if (id === GCP.label) return GCP.color;
  if (id === AWS.label) return AWS.color;
  if (id === AZURE.label) return AZURE.color;
  else return GCP.color;
};

interface CostTrendChartProps {
  dateAxis?: CostTrend['dateAxis'];
  series?: CostTrend['series'];
}

export const CostTrendChart = ({
  dateAxis: costTrendDateAxis,
  series: costTrendSeries,
}: CostTrendChartProps) => {
  const theme = useTheme();
  const { data } = useSession();
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);

  const isGroupedByCloudProvider =
    platform === CrossCloudValue.FOCUS &&
    platformFilters.groupBy.type === FOCUSGroupBy.CloudServiceProvider;

  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);
  const currencyInfo = data?.user.currencyInfo;

  const hasCredits = hasCreditsSelected(platform, platformFilters);

  const legends = useMemo(
    () =>
      costTrendSeries?.map(({ title, id, platform: seriesPlatform }, index) => ({
        id: id ?? `series-${index}`,
        // FOCUS 模式下 GCP 的 series 來源是 Google Cloud，加前綴以區分顯示
        label: seriesPlatform === PlatformsValue.GCP ? `[Google Cloud] ${title}` : title,
        // 按 Cloud Provider 分組時，用各 provider 的品牌色（依 series id 辨識 provider）
        // 其他分組方式則循環使用預設調色盤
        color: isGroupedByCloudProvider
          ? getCloudProviderLegendColor(id)
          : COLOR_KIT[index % COLOR_KIT.length],
        // FOCUS 模式的 GCP series 混合了 GCP native 與 FOCUS 資料，需 tooltip 說明差異
        tooltipText: seriesPlatform === PlatformsValue.GCP ? GCP_FOCUS_TOOLTIP : undefined,
      })) ?? [],
    [costTrendSeries, isGroupedByCloudProvider]
  );

  const series = useMemo<BarSeriesOption[]>(() => {
    if (!costTrendSeries) return [];

    return costTrendSeries.map(({ title, data, credits }) => ({
      name: title,
      type: 'bar',
      stack: 'all',
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
      data: hasCredits ? data.map((cost, index) => cost + (credits[index] ?? 0)) : data,
    }));
  }, [costTrendSeries, hasCredits]);

  const creditsPerIndex = useMemo(
    () =>
      costTrendDateAxis?.map(
        (_, i) => costTrendSeries?.reduce((acc, item) => acc + (item.credits[i] ?? 0), 0) ?? 0
      ) ?? [],
    [costTrendDateAxis, costTrendSeries]
  );

  const renderTooltip = useCallback(
    (index: number) => {
      if (!costTrendSeries?.length || !costTrendDateAxis?.length) return '';

      // 從 series 資料重建 ECharts params，避免在 formatter 中即時 renderToString
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      const params = costTrendSeries.map((seriesItem, seriesIdx) => ({
        seriesName: seriesItem.title,
        seriesIndex: seriesIdx,
        value: hasCredits
          ? seriesItem.data[index] + (seriesItem.credits[index] ?? 0)
          : seriesItem.data[index],
        color: COLOR_KIT[seriesIdx % COLOR_KIT.length],
        name: costTrendDateAxis[index],
      })) as CallbackDataParams[];

      return renderToString(
        <CostTrendChartTooltip
          hasCreditsFilter={hasCredits}
          creditsValue={creditsPerIndex[index] ?? 0}
          params={params}
          hoveredSeriesIndex={null}
          period={platformFilters.period}
          currencySymbol={currencyInfo?.symbol}
        />
      );
    },
    [
      costTrendSeries,
      costTrendDateAxis,
      hasCredits,
      creditsPerIndex,
      platformFilters.period,
      currencyInfo?.symbol,
    ]
  );

  const { getTooltipHtml } = useTooltipCache({
    itemCount: costTrendDateAxis?.length ?? 0,
    renderTooltip,
  });

  const options: EChartsOption = useMemo(
    () => ({
      color: [...COLOR_KIT],
      tooltip: {
        trigger: 'axis',
        enterable: true,
        confine: true,
        padding: 0,
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: alpha(palette.colorKit.dark[11], 0.1),
          },
        },
        position: (point, _params, _dom, _rect, size) => {
          const [x, y] = point;
          const tooltipHeight = size.contentSize[1];
          return [x + 5, y - tooltipHeight - 5];
        },
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          const firstParam = Array.isArray(params) ? params[0] : params;
          return getTooltipHtml(firstParam.dataIndex);
        },
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 20,
        containLabel: true,
      },
      legend: {
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: costTrendDateAxis,
        axisTick: { show: false },
        axisLabel: {
          color: theme.palette.text.primary,
          width: 80,
          overflow: 'truncate',
          rotate: 45,
          formatter: (value) =>
            format(new Date(value), platformFilters.period === Granularity.Day ? 'd MMM.' : 'MMM.'),
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.gray.borderDark,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: theme.palette.text.primary,
          formatter: (value) => getChartYAxisLabel(value),
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      barMaxWidth: 16,
      barCategoryGap: '20%',
      barGap: '25%',
      series,
    }),
    [series, theme, costTrendDateAxis, platformFilters.period, getTooltipHtml]
  );

  return (
    <Stack sx={{ gap: 2.5, width: '100%' }}>
      <ReactECharts ref={chartRef} option={options} style={{ height: 400, width: '100%' }} />
      <CollapsibleLegends legends={legends} />
    </Stack>
  );
};
