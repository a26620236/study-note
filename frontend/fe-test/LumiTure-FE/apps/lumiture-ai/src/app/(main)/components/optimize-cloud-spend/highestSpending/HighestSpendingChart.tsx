import { useRef } from 'react';

import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useSession } from 'next-auth/react';

import { palette } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver } from '@shared/hooks';

import type {
  AcceptPlatforms,
  HighestSpendingChartProps,
} from '@app/(main)/components/optimize-cloud-spend/types';
import { createTooltipFormatter } from '@app/(main)/components/optimize-cloud-spend/utils';
import { transformGroupData } from '@app/(main)/components/optimize-cloud-spend/utils/transformGroupData';
import { generateSortedSeries } from '@app/(main)/overview/spending-rankings/utils/generateSortedSeries';

const HighestSpendingChart = ({
  sourceData,
  isScreenshotMode = false,
}: HighestSpendingChartProps) => {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);
  const theme = useTheme();

  const { data: session } = useSession();
  const currencySymbol = session?.user.currencyInfo.symbol;

  const groupData = transformGroupData(sourceData);

  const { series, groupNames } = generateSortedSeries(groupData, 'desc');

  const options: EChartsOption = {
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
    legend: {
      selectedMode: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      data: series.map(({ name }) => name) as AcceptPlatforms,
      top: 'bottom',
      icon: 'rect',
      itemWidth: 16,
      itemHeight: 12,
    },
    grid: {
      left: 20,
      right: 0,
      bottom: 20,
      top: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
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
    yAxis: {
      type: 'value',
      axisLabel: {
        color: theme.palette.text.primary,
        formatter: (value: number) => getChartYAxisLabel(value, 0),
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    barWidth: 16,
    barCategoryGap: '20%',
    barGap: '25%',
    animation: !isScreenshotMode,
    series,
  };

  return (
    <Stack sx={{ height: 400 }}>
      <ReactECharts ref={chartRef} option={options} style={{ height: '100%' }} />
    </Stack>
  );
};

export default HighestSpendingChart;
