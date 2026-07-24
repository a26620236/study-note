'use client';

import { useCallback, useMemo, useRef } from 'react';

import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { basicColor, theme } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import { getChartTooltipPosition } from '@app/(main)/dashboard/executive-insights/utils/getChartTooltipPosition';
import type { CVRMetricsTrendChart } from '@hooks-api';

import { CVRMetricsChartToolTip } from './CVRMetricsChartToolTip';

interface CVRMetricsChartProps {
  data?: CVRMetricsTrendChart;
}

const LABELS = {
  expectedValue: 'Expected Value',
  realizedValue: 'Realized Value',
  actualCost: 'Actual Cost',
};

export function CVRMetricsChart({ data }: CVRMetricsChartProps) {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);

  const { data: session } = useSession();
  const currencyInfo = session?.user.currencyInfo;

  const months = useMemo(
    () => data?.date.map((dateStr) => format(new Date(dateStr), 'MMM.')),
    [data?.date]
  );

  const { expectedValues, realizedValues, actualCosts } = data ?? {};

  const renderTooltip = useCallback(
    (index: number) =>
      renderToString(
        <CVRMetricsChartToolTip index={index} data={data} currencySymbol={currencyInfo?.symbol} />
      ),
    [data, currencyInfo?.symbol]
  );

  const { getTooltipHtml } = useTooltipCache({
    itemCount: data?.date.length ?? 0,
    renderTooltip,
  });

  const option: EChartsOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      graphic: {
        elements: [
          {
            type: 'text',
            top: '1%',
            left: '1%',
            style: {
              text: `Cost (${currencyInfo?.value ?? ''})`,
              fontSize: 12,
              fill: theme.palette.text.hint,
            },
          },
        ],
      },
      grid: {
        left: '4%',
        right: '0%',
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: {
          show: true,
          lineStyle: {
            color: theme.palette.gray.border,
            width: 1,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'black',
          margin: 12,
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          margin: 15,
          color: theme.palette.text.primary,
          fontSize: 12,
          lineHeight: 18,
          formatter: (value: number) => getChartYAxisLabel(value),
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme.palette.gray.border,
            width: 1,
            type: 'dashed',
          },
        },
        splitNumber: 4,
        min: 0,
      },
      legend: {
        data: [LABELS.expectedValue, LABELS.realizedValue, LABELS.actualCost],
        bottom: '0%',
        left: 'center',
        itemGap: 10,
        textStyle: {
          color: theme.palette.text.secondary,
          fontSize: 12,
        },
        itemWidth: 30,
        itemHeight: 3,
        height: 'auto',
        orient: 'horizontal',
      },
      series: [
        {
          name: LABELS.expectedValue,
          type: 'line',
          data: expectedValues,
          smooth: true,
          lineStyle: {
            color: basicColor.secondary.turquoiseBlue[70],
            width: 2,
            type: 'dashed',
          },
          itemStyle: {
            color: basicColor.secondary.turquoiseBlue[70],
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: LABELS.realizedValue,
          type: 'line',
          data: realizedValues,
          smooth: true,
          lineStyle: {
            color: theme.palette.colorKit.dark[5],
            width: 2,
          },
          itemStyle: {
            color: theme.palette.colorKit.dark[5],
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: LABELS.actualCost,
          type: 'line',
          data: actualCosts,
          smooth: true,
          lineStyle: {
            color: theme.palette.colorKit.dark[1],
            width: 2,
          },
          itemStyle: {
            color: theme.palette.colorKit.dark[1],
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: alpha(theme.palette.colorKit.dark[11], 0.1),
          },
        },
        position: getChartTooltipPosition,
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          const param = Array.isArray(params) ? params[0] : params;
          return getTooltipHtml(param.dataIndex);
        },
      },
    }),
    [months, expectedValues, realizedValues, actualCosts, currencyInfo?.value, getTooltipHtml]
  );

  return <ReactECharts ref={chartRef} option={option} style={{ height: '268px', width: '100%' }} />;
}
