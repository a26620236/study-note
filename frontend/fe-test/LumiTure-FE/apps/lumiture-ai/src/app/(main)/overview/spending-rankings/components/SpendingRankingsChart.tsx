'use client';

import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';

import { palette } from '@lumiture-ui/theme';

import type { AcceptPlatforms } from '@app/(main)/components/optimize-cloud-spend/types';
import { createTooltipFormatter } from '@app/(main)/components/optimize-cloud-spend/utils';
import { transformGroupData } from '@app/(main)/components/optimize-cloud-spend/utils/transformGroupData';
import { generateSortedSeries } from '@app/(main)/overview/spending-rankings/utils/generateSortedSeries';
import type { SpendingGroup } from '@hooks-api';

interface SpendingRankingsChartProps {
  sourceData: SpendingGroup[];
  isScreenshotMode?: boolean;
}

const SpendingRankingsChart = ({ sourceData, isScreenshotMode }: SpendingRankingsChartProps) => {
  const theme = useTheme();

  const { data: session } = useSession();
  const currencySymbol = session?.user.currencyInfo.symbol;

  const groupData = transformGroupData(sourceData);
  const { series, groupNames } = generateSortedSeries(groupData, 'asc');

  const tickHeight = 80;
  const numTicks = groupNames.length;
  const chartHeight = numTicks * tickHeight;

  const options: EChartsOption = {
    series,
    xAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: groupNames,
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        color: theme.palette.text.primary,
        width: 80,
        overflow: 'truncate',
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.gray.borderDark,
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: alpha(palette.colorKit.dark[11], 0.1),
        },
      },
      formatter: createTooltipFormatter(currencySymbol),
    },
    grid: {
      left: 10,
      right: 30,
      bottom: 0,
      top: 40,
      containLabel: true,
    },
    legend: {
      selectedMode: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      data: series.map(({ name }) => name) as AcceptPlatforms,
      left: 0,
      top: 0,
      icon: 'rect',
      itemWidth: 16,
      itemHeight: 12,
    },
    barWidth: 15,
    barCategoryGap: '100%',
    barGap: '30%',
    animation: !isScreenshotMode,
  };

  return (
    <Stack sx={{ height: chartHeight }}>
      <ReactECharts option={options} style={{ height: '100%' }} />
    </Stack>
  );
};

export default SpendingRankingsChart;
