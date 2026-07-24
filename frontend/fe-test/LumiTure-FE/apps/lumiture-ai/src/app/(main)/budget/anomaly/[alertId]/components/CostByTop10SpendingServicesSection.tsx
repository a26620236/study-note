import { useCallback, useRef } from 'react';

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';
import { renderToString } from 'react-dom/server';

import { HStack, VStack } from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import { CollapsibleLegends } from '@components/echart/CollapsibleLegends';
import { COLOR_KIT } from '@constants';
import type { TrendData } from '@hooks-api';

import {
  CostByTop10SpendingServicesTooltip,
  type TooltipData,
} from './CostByTop10SpendingServicesTooltip';

interface CostByTop10SpendingServicesSectionProps {
  data: TrendData;
  isScreenshotMode?: boolean;
}

const LABELS = {
  title: 'Cost by Top Spending 10 Services',
  tooltip:
    'Visualizes the cost trends of the top 10 highest-spending services leading up to the anomaly date, with all remaining services grouped as "Others." Hourly cost breakdown for the 3-day period ending on the anomaly date.',
};

const TOP_10_SERVICES_COLORS = [...COLOR_KIT, basicColor.achromatic.gray[30]];

export function CostByTop10SpendingServicesSection({
  data,
  isScreenshotMode = false,
}: CostByTop10SpendingServicesSectionProps) {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);

  const { dates, ranking, ...servicesData } = data;

  const renderTooltip = useCallback(
    (dateIndex: number) => {
      const dateStr = dates[dateIndex];
      const tooltipData: TooltipData = {
        date: format(new Date(dateStr), 'dd MMM. yyyy HH:mm'),
        services: ranking.map((serviceName, index) => ({
          name: serviceName,
          value: servicesData[serviceName][dateIndex],
          color: TOP_10_SERVICES_COLORS[index],
        })),
      };
      return renderToString(<CostByTop10SpendingServicesTooltip data={tooltipData} />);
    },
    [dates, ranking, servicesData]
  );

  const { getTooltipHtml } = useTooltipCache({
    itemCount: dates.length,
    renderTooltip,
  });

  const option: EChartsOption = {
    tooltip: {
      show: true,
      trigger: 'axis',
      confine: true,
      borderWidth: 0,
      formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
        const param = Array.isArray(params) ? params[0] : params;
        return getTooltipHtml(param.dataIndex);
      },
    },
    graphic: {
      elements: [
        {
          type: 'text',
          top: '1%',
          left: '1%',
          style: {
            text: 'Cost(USD)',
            fontSize: 12,
            fill: theme.palette.text.hint,
          },
        },
      ],
    },
    legend: {
      show: false,
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '0%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
        interval: (index: number) => new Date(dates[index]).getHours() % 8 === 0,
        formatter: (value: string) => {
          const date = new Date(value);
          return `${format(date, 'dd MMM.')}\n${format(date, 'HH:mm')}`;
        },
        margin: 12,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: basicColor.achromatic.gray[90],
        formatter: (value: number) => getChartYAxisLabel(value),
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: theme.palette.gray.border,
          width: 1,
          type: [5, 5],
        },
      },
      splitNumber: 5,
    },
    series: ranking.map((serviceName, index) => ({
      name: serviceName,
      type: 'line',
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 1.5,
      },
      emphasis: {
        disabled: true,
      },
      data: servicesData[serviceName],
      color: TOP_10_SERVICES_COLORS[index],
    })),
  };

  return (
    <VStack gap={4} sx={{ width: '100%' }}>
      <HStack alignItems="center" gap={1}>
        <Typography variant="h5">{LABELS.title}</Typography>
        <Tooltip title={LABELS.tooltip}>
          <InfoRoundedIcon sx={{ fontSize: 16, color: 'text.hint' }} />
        </Tooltip>
      </HStack>
      <ReactECharts ref={chartRef} option={option} style={{ height: '310px', width: '100%' }} />
      <CollapsibleLegends
        legends={ranking.map((serviceName, index) => ({
          id: serviceName,
          label: serviceName,
          color: TOP_10_SERVICES_COLORS[index],
        }))}
        defaultExpanded={isScreenshotMode}
      />
    </VStack>
  );
}
