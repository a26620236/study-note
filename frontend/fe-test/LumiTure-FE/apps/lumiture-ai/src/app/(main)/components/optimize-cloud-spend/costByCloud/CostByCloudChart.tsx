import { useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme, type SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { BarSeriesOption, EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';
import { renderToString } from 'react-dom/server';

import { palette } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import Tooltip from '@app/(main)/components/optimize-cloud-spend/costByCloud/Tooltip';
import type {
  CloudDataset,
  CloudDatasetItem,
  CostByCloudTooltipParam,
} from '@app/(main)/components/optimize-cloud-spend/types';
import { AWS, AZURE, GCP, PlatformsValue } from '@constants';
import type { CostByCloudItem, OverviewByCloud } from '@hooks-api';

const BAR_STACK = {
  COST: 'cost',
  BUDGET: 'budget',
};

const SERIES_NAMES = ['cost', 'budget', 'overrun'] as const;

// NOTE: 等設計更新 chart 色碼後再將 hardcode 改成 palette 引入
export const cloudBarStyleSchema = {
  [PlatformsValue.GCP]: {
    cost: {
      label: 'Actual Cost',
      itemStyle: {
        color: GCP.color,
      },
    },
    budget: {
      label: 'Remaining Budget',
      itemStyle: {
        color: '#E6F6FF',
        borderColor: '#7CB5EC',
        borderWidth: 1,
        borderType: 'dashed',
      },
    },
  },
  [PlatformsValue.AWS]: {
    cost: {
      label: 'Actual Cost',
      itemStyle: {
        color: AWS.color,
      },
    },
    budget: {
      label: 'Remaining Budget',
      itemStyle: {
        color: palette.colorKit.light[6],
        borderColor: palette.colorKit.main[6],
        borderWidth: 1,
        borderType: 'dashed',
      },
    },
  },
  [PlatformsValue.AZURE]: {
    cost: {
      label: 'Actual Cost',
      itemStyle: {
        color: AZURE.color,
      },
    },
    budget: {
      label: 'Remaining Budget',
      itemStyle: {
        color: palette.colorKit.light[2],
        borderColor: palette.colorKit.dark[2],
        borderWidth: 1,
        borderType: 'dashed',
      },
    },
  },
} as const;

const LegendItem = ({ text, sx }: { text: string; sx?: SxProps }) => (
  <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
    <Box sx={{ width: 16, height: 12, ...sx }} />
    <Typography variant="caption" color="text.secondary">
      {text}
    </Typography>
  </Stack>
);

const getMaxValue = (values: number[]) => Math.max(...values.map(Math.abs), 0);

export const getCloudDataset = (data: Partial<OverviewByCloud['costByCloud']>): CloudDataset =>
  Object.keys(data).reduce<CloudDataset>((result, platform) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    const platformKey = platform as PlatformsValue;
    const platformData = data[platformKey];
    const platformStyle = cloudBarStyleSchema[platformKey];

    if (!platformData) return result;

    Object.keys(platformStyle).forEach((_type) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      const type = _type as keyof CostByCloudItem;

      result[type] ??= [];
      result[type].push({
        value: platformData[type],
        itemStyle: platformStyle[type].itemStyle,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    result.overrun ??= [];

    const calculateOverrun = () => {
      if (typeof platformData.cost !== 'number' || typeof platformData.budget !== 'number') {
        return null;
      }
      const difference = platformData.cost - platformData.budget;
      return difference <= 0 ? null : difference;
    };

    const overrunValue = calculateOverrun();

    result.overrun.push({
      value: overrunValue,
      itemStyle: { color: palette.error.dark },
    });

    return result;
  }, {});

export const findMaxOverrun = (data: CloudDatasetItem[]) =>
  data.reduce(
    (acc, curr, index) => {
      if (curr.value !== null && curr.value > 0 && curr.value > acc.maxOverrun) {
        return { maxOverrun: curr.value, maxOverrunIndex: index };
      }
      return acc;
    },
    { maxOverrun: 0, maxOverrunIndex: -1 }
  );

interface CostByCloudChartProps {
  sourceData?: OverviewByCloud['costByCloud'];
  isScreenshotMode?: boolean;
}

const CostByCloudChart = ({ sourceData, isScreenshotMode = false }: CostByCloudChartProps) => {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);
  const theme = useTheme();
  const formattedSourceData = Object.fromEntries(
    Object.entries(sourceData ?? {}).filter(
      ([cloud, data]) => !!Object.values(data).length && cloud in cloudBarStyleSchema
    )
  );
  const cloudDataset = getCloudDataset(formattedSourceData);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const clouds = Object.keys(formattedSourceData) as PlatformsValue[];
  const values = Object.values(formattedSourceData).reduce<number[]>((acc, curr) => {
    if (typeof curr.cost !== 'number' || typeof curr.budget !== 'number') return acc;

    if (curr.cost > curr.budget) {
      acc.push(curr.cost + curr.cost - curr.budget);
    }
    acc.push(...[curr.cost, curr.budget]);
    return acc;
  }, []);
  const maxValue = getMaxValue(values);

  const { maxOverrun, maxOverrunIndex } = findMaxOverrun(cloudDataset.overrun);

  const renderTooltip = useCallback(
    (dataIndex: number) => {
      const tooltipParams: CostByCloudTooltipParam[] = SERIES_NAMES.map((seriesName) => ({
        axisValueLabel: clouds[dataIndex],
        value: cloudDataset[seriesName][dataIndex]?.value ?? null,
        seriesName,
        seriesId: seriesName,
      }));
      return renderToString(
        <Tooltip params={tooltipParams} cloudBarStyleSchema={cloudBarStyleSchema} />
      );
    },
    [clouds, cloudDataset]
  );

  const { getTooltipHtml } = useTooltipCache({
    itemCount: clouds.length,
    renderTooltip,
  });

  const options: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: alpha(palette.colorKit.dark[11], 0.1),
        },
      },
      formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
        const tooltipParams = Array.isArray(params) ? params : [params];
        return getTooltipHtml(tooltipParams[0].dataIndex);
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: 20,
      right: 0,
      bottom: 0,
      top: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: clouds,
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        color: theme.palette.text.primary,
        width: 80,
        overflow: 'truncate',
        formatter: (value) => value.toUpperCase(),
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.gray.borderDark,
        },
      },
    },
    yAxis: {
      type: 'value',
      // maxValue 有可能為 0，若為 0 就不定義直接回傳 undefined
      max: maxValue ? maxValue * 1.1 : undefined,
      interval: maxValue ? (maxValue * 1.1) / 2 : undefined,
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
    animation: !isScreenshotMode,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    series: [
      {
        name: 'cost',
        type: 'bar',
        stack: BAR_STACK.COST,
        barGap: '-100%',
        z: 2,
        data: cloudDataset.cost,
      },
      {
        name: 'budget',
        type: 'bar',
        stack: BAR_STACK.BUDGET,
        barWidth: 16,
        z: 1,
        data: cloudDataset.budget,
      },
      {
        name: 'overrun',
        type: 'bar',
        stack: BAR_STACK.BUDGET,
        itemStyle: { color: theme.palette.error.dark },
        markPoint: {
          label: { show: false },
          symbolSize: 16,
          symbolOffset: [0, -12],
          symbol:
            'path://M14.26 12.13a1.1 1.1 0 0 1-.4 1.5c-.16.09-.34.14-.53.14H2.67a1.05 1.05 0 0 1-.93-.55 1.11 1.11 0 0 1 0-1.09l5.34-9.45A1.08 1.08 0 0 1 8 2.13a1.05 1.05 0 0 1 .92.55l5.34 9.45ZM8 10.18a1 1 0 0 0-.57.17A1.04 1.04 0 0 0 7 11.43c.04.2.13.39.28.53a1.01 1.01 0 0 0 1.11.23 1.06 1.06 0 0 0 0-1.93 1 1 0 0 0-.39-.08Zm-.97-3.76.16 3.1c0 .07.04.13.09.18.05.05.11.07.18.07h1.08c.07 0 .13-.02.18-.07a.28.28 0 0 0 .08-.18l.17-3.1a.28.28 0 0 0-.07-.2.27.27 0 0 0-.2-.09H7.3a.26.26 0 0 0-.2.1.27.27 0 0 0-.07.2Z',
          data: maxOverrun
            ? [{ name: 'Max', type: 'max', xAxis: maxOverrunIndex, yAxis: maxOverrun }]
            : [],
        },
        data: maxOverrunIndex > -1 ? cloudDataset.overrun : [],
      },
    ] as BarSeriesOption[],
  };

  return (
    <Stack sx={{ width: '100%', gap: 3 }}>
      <ReactECharts ref={chartRef} option={options} style={{ height: 140, width: '100%' }} />
      <Stack direction="row" sx={{ gap: 2, mx: 'auto' }}>
        <LegendItem text="Actual Cost" sx={{ bgcolor: palette.colorKit.dark[11] }} />
        <LegendItem
          text="Remaining Budget"
          sx={{
            border: '1px dashed',
            borderColor: palette.colorKit.dark[11],
            bgcolor: '#EDEDED',
          }}
        />
        <LegendItem text="Budget Overrun" sx={{ bgcolor: theme.palette.error.dark }} />
      </Stack>
    </Stack>
  );
};

export default CostByCloudChart;
