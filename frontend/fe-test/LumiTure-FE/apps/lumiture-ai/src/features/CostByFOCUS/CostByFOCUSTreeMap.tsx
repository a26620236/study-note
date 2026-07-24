'use client';

import { useMemo, useRef } from 'react';

import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { theme } from '@lumiture-ui/theme';
import { nFormatAbbreviation } from '@shared/utils';
import { useChartResizeObserver } from '@shared/hooks';

import type { Top10CostByFOCUS } from '@hooks-api';

import { CostByFOCUSTreeMapTooltip, type TooltipData } from './CostByFOCUSTreeMapTooltip';

interface CostByFOCUSTreeMapProps {
  data: Top10CostByFOCUS[];
}

const rankingColor = [
  theme.palette.colorKit.main[2],
  theme.palette.colorKit.main[4],
  theme.palette.colorKit.main[6],
  theme.palette.colorKit.main[10],
  theme.palette.colorKit.main[9],
  theme.palette.colorKit.main[8],
  theme.palette.colorKit.main[7],
  theme.palette.colorKit.main[5],
  theme.palette.colorKit.main[3],
  theme.palette.colorKit.main[1],
];

export function CostByFOCUSTreeMap({ data }: CostByFOCUSTreeMapProps) {
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);

  const { data: session } = useSession();
  const currency = session?.user.currencyInfo;

  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        name: item.name,
        value: item.spending,
        itemStyle: { color: rankingColor[item.ranking - 1] },
      })),
    [data]
  );

  // Pre-render and cache all tooltip HTML to enhance performance
  const tooltipCache = useMemo(() => {
    const cache = new Map<string, string>();
    formattedData.forEach((item) => {
      const tooltipData: TooltipData = {
        name: item.name,
        value: item.value,
        color: item.itemStyle.color,
      };
      const html = renderToString(
        <CostByFOCUSTreeMapTooltip data={tooltipData} currencySymbol={currency?.symbol} />
      );
      cache.set(item.name, html);
    });
    return cache;
  }, [currency, formattedData]);

  const options: EChartsOption = {
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true,
      borderWidth: 0,
      enterable: true,
      extraCssText: 'user-select: text',
      formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
        const param = Array.isArray(params) ? params[0] : params;
        return tooltipCache.get(param.name) || '';
      },
    },
    series: [
      {
        type: 'treemap',
        data: formattedData,
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false,
        },
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        itemStyle: {
          gapWidth: 4,
          borderRadius: 4,
        },
        label: {
          show: true,
          position: 'inside',
          align: 'center',
          verticalAlign: 'middle',
          fontSize: 12,
          fontWeight: 700,
          color: theme.palette.white.main,
          lineHeight: 18,
          formatter: (params: CallbackDataParams) => {
            const value =
              typeof params.value === 'number'
                ? nFormatAbbreviation({
                    num: Math.abs(params.value),
                    prefix: `${currency?.value} `,
                  })
                : '0.00';
            return `${params.name}\n${value}`;
          },
        },
      },
    ],
  };

  return (
    <ReactECharts ref={chartRef} option={options} style={{ width: '100%', height: '388px' }} />
  );
}
