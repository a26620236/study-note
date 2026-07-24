'use client';

import { useCallback, useMemo, useRef } from 'react';

import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import { getChartTooltipPosition } from '@app/(main)/dashboard/executive-insights/utils/getChartTooltipPosition';
import type { CloudCostPerCustomerTrendChart } from '@hooks-api';

import { CloudCostPerCustomerMonthlyTrendChartTooltip } from './CloudCostPerCustomerMonthlyTrendChartTooltip';

interface CloudCostPerCustomerMonthlyTrendChartProps {
  data?: CloudCostPerCustomerTrendChart | null;
}

const LABELS = {
  monthlyTrend: 'Monthly Trend',
  noData: 'No Data Available',
};

export function CloudCostPerCustomerMonthlyTrendChart({
  data,
}: CloudCostPerCustomerMonthlyTrendChartProps) {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);

  const { data: session } = useSession();
  const currencyInfo = session?.user.currencyInfo;

  const { date, values } = data ?? { date: [], values: [] };

  const formattedDates = useMemo(
    () => date.map((dateString) => format(new Date(dateString), 'MMM.')),
    [date]
  );

  const yAxisConfig = useMemo(() => {
    if (values.length === 0) {
      return;
    }
    const max = Math.ceil(Math.max(...values));
    const interval = max / 2;

    return {
      interval,
      min: 0,
      max,
    };
  }, [values]);

  const renderTooltip = useCallback(
    (dataIndex: number) => {
      if (!data) return '';

      return renderToString(
        <CloudCostPerCustomerMonthlyTrendChartTooltip
          data={data}
          dataIndex={dataIndex}
          currencySymbol={currencyInfo?.symbol}
        />
      );
    },
    [data, currencyInfo?.symbol]
  );

  const { getTooltipHtml } = useTooltipCache({
    itemCount: formattedDates.length,
    renderTooltip,
  });

  const option: EChartsOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      graphic: {
        elements: [
          {
            type: 'text',
            top: '0%',
            style: {
              text: LABELS.monthlyTrend,
              fontSize: 12,
              fontWeight: 'bold',
              fill: theme.palette.text.secondary,
            },
          },
        ],
      },
      grid: {
        left: '4%',
        right: '0%',
        bottom: '0%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: formattedDates,
        axisLine: {
          show: true,
          lineStyle: {
            color: 'black',
            width: 1,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: theme.palette.text.primary,
          margin: 10,
          fontSize: 14,
          interval: (index: number) => index === 0 || index === formattedDates.length - 1,
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
          color: theme.palette.text.primary,
          fontSize: 12,
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
        ...yAxisConfig,
      },
      series: [
        {
          name: LABELS.monthlyTrend,
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: {
            color: theme.palette.colorKit.dark[2],
            width: 2,
            type: 'solid',
          },
          itemStyle: {
            color: theme.palette.colorKit.dark[2],
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
        formatter: (params: { dataIndex: number } | { dataIndex: number }[]) => {
          const tooltipParams = Array.isArray(params) ? params : [params];
          return getTooltipHtml(tooltipParams[0].dataIndex);
        },
      },
    }),
    [formattedDates, yAxisConfig, values, getTooltipHtml]
  );

  if (!data) {
    return (
      <VStack style={{ height: '112px', width: '100%' }}>
        <Typography variant="captionBold" color="text.secondary">
          {LABELS.monthlyTrend}
        </Typography>
        <VStack alignItems="center" justifyContent="center" flex={1}>
          <Typography variant="h6" color="text.hint">
            {LABELS.noData}
          </Typography>
        </VStack>
      </VStack>
    );
  }

  return <ReactECharts ref={chartRef} option={option} style={{ height: '120px', width: '100%' }} />;
}
