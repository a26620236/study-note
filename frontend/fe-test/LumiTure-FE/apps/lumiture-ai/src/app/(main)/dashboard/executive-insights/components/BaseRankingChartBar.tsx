'use client';

import { useMemo, useRef } from 'react';

import { alpha } from '@mui/material/styles';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';
import { useSession } from 'next-auth/react';

import { theme } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import { getChartTooltipPosition } from '@app/(main)/dashboard/executive-insights/utils/getChartTooltipPosition';

import { getEndPeriod } from '../utils/getEndPeriod';

interface BaseRankingChartBarData {
  groupName: string;
  spending: number;
}

interface BaseRankingChartBarProps {
  data: BaseRankingChartBarData[];
  period?: { start?: string; end?: string };
  getBarColor: (index: number) => string;
  renderTooltip: (index: number) => string;
}

const LABELS = {
  getCostLabel: (currency: string) => `Cost (${currency})`,
};

const formatAxisLabel = (value: string): string => {
  if (value.length <= 12) return value;

  // 使用函數式方法找到最接近中間位置的空格索引
  const middle = value.length / 2;
  const spaceIndexes = Array.from(value.matchAll(/ /gu), (match) => match.index);

  const closestSpaceIndex =
    spaceIndexes.length === 0
      ? -1
      : spaceIndexes.reduce((closest, current) =>
          Math.abs(current - middle) < Math.abs(closest - middle) ? current : closest
        );

  // 無空格時直接截斷
  if (closestSpaceIndex === -1) {
    return `${value.substring(0, 12)}...`;
  }

  // 在最佳位置分割並處理長度限制
  const firstLine = value.substring(0, closestSpaceIndex);
  const secondLine = value.substring(closestSpaceIndex + 1);

  if (firstLine.length > 12) {
    return `${firstLine.substring(0, 12)}...`;
  }

  return [
    firstLine,
    secondLine.length > 12 ? `${secondLine.substring(0, 12)}...` : secondLine,
  ].join('\n');
};

export function BaseRankingChartBar({
  data,
  period,
  getBarColor,
  renderTooltip,
}: BaseRankingChartBarProps) {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);

  const { data: session } = useSession();
  const currencyInfo = session?.user.currencyInfo;

  const { getTooltipHtml } = useTooltipCache({
    itemCount: data.length,
    renderTooltip,
  });

  const option: EChartsOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      graphic: {
        elements: [
          {
            type: 'text',
            left: '0%',
            top: '0%',
            style: {
              text: LABELS.getCostLabel(currencyInfo?.value ?? ''),
              fontSize: 12,
              fill: theme.palette.text.hint,
            },
          },
          {
            type: 'text',
            right: '0%',
            top: '0%',
            style: {
              text: getEndPeriod(period?.end),
              fontSize: 14,
              fontStyle: 'italic',
              fill: theme.palette.text.hint,
            },
          },
        ],
      },
      grid: {
        left: '4%',
        right: '0%',
        top: '15%',
        bottom: '0%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.groupName),
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
          color: theme.palette.text.primary,
          fontSize: 12,
          rotate: 45,
          margin: 15,
          formatter: formatAxisLabel,
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
        splitNumber: 4,
        min: 0,
      },
      series: [
        {
          type: 'bar',
          data: data.map((item, index) => ({
            value: item.spending,
            itemStyle: {
              color: getBarColor(index),
            },
          })),
          barWidth: '16px',
          emphasis: {
            focus: 'series',
            itemStyle: {
              opacity: 0.8,
            },
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
    [period?.end, data, getBarColor, getTooltipHtml, currencyInfo]
  );

  return <ReactECharts ref={chartRef} option={option} style={{ width: '100%', height: '320px' }} />;
}
