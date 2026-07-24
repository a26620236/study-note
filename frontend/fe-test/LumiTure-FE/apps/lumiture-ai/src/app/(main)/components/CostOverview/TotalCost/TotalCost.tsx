import { useCallback, useRef } from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format, getMonth, getYear } from 'date-fns';
import { graphic } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { basicColor } from '@lumiture-ui/theme';
import { getChartYAxisLabel } from '@shared/utils';
import { useChartResizeObserver, useTooltipCache } from '@shared/hooks';

import { ACCUMULATE_COST, COST_STATUS } from '@app/(main)/components/CostOverview/constants';
import TotalCostTooltip from '@app/(main)/components/CostOverview/TotalCost/TotalCostTooltip';
import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import { DEFAULT_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import type { GetDashboardOverviewOrgRes } from '@hooks-api';

interface TooltipParams extends CallbackDataParams {
  axisValueLabel: string;
}
type TotalCostProps = Pick<GetDashboardOverviewOrgRes, 'totalCost'>['totalCost'] & {
  year: string;
  isError?: boolean;
  isScreenshotMode?: boolean;
};

type CostStatusValue = (typeof COST_STATUS)[keyof typeof COST_STATUS];

const costStatusPalette = {
  normal: { light: basicColor.primary.navyBlue[20], main: basicColor.primary.navyBlue[60] },
  alert: { light: basicColor.secondary.red[10], main: basicColor.secondary.red[90] },
};

const costConfig = {
  [COST_STATUS.ACTUAL_COST]: {
    name: COST_STATUS.ACTUAL_COST,
    itemStyle: { color: costStatusPalette.normal.main },
  },
  [COST_STATUS.OVERSPENT]: {
    name: COST_STATUS.OVERSPENT,
    itemStyle: { color: costStatusPalette.alert.main },
  },
  [COST_STATUS.FORECAST_COST]: {
    name: COST_STATUS.FORECAST_COST,
    itemStyle: {
      color: costStatusPalette.normal.light,
      borderColor: costStatusPalette.normal.main,
      borderWidth: 1,
      borderType: 'dashed',
    },
  },
  [COST_STATUS.FORECAST_OVERSPEND]: {
    name: COST_STATUS.FORECAST_OVERSPEND,
    itemStyle: {
      color: costStatusPalette.alert.light,
      borderColor: costStatusPalette.alert.main,
      borderWidth: 1,
      borderType: 'dashed',
    },
  },
};

const LABELS = {
  chartTitle: 'Total Cost',
  yourBudget: 'Your Budget',
  periodPrefix: 'Period',
  costAxisPrefix: 'Cost',
} as const;

const monthLabels = Array.from({ length: 12 }, (_, i) => format(new Date(0, i), 'MMM.'));

function getCurrentYearMonthArray(year?: string) {
  const currentYear = year || getYear(new Date());
  const yearMonthArray = [];

  for (let month = 0; month < 12; month++) {
    const yearMonth = format(new Date(Number(currentYear), month, 1), 'yyyyMM');
    yearMonthArray.push(yearMonth);
  }
  return yearMonthArray;
}

const getYearlyCost = ({
  year,
  spending,
  predict,
  actualToForecastIndex,
}: {
  year: string;
  spending: TotalCostProps['spending'];
  predict: TotalCostProps['predict'];
  actualToForecastIndex: number;
}): (number | null)[] => {
  const currentYearMonth = getCurrentYearMonthArray(year);
  // 可能會拿到 size 非 month.length 的 Object，所以要補 null
  const [spendingArr, predictArr] = [spending, predict].map((_spendingObj) =>
    currentYearMonth.map((_monthStr) => {
      const amountOfMonth = _spendingObj?.[_monthStr];
      // 處理區分 0 和 null 的情況
      if (typeof amountOfMonth === 'number') return amountOfMonth;
      return null;
    })
  );
  return [
    ...spendingArr.slice(0, actualToForecastIndex),
    ...predictArr.slice(actualToForecastIndex),
  ];
};

export function TotalCost({
  year,
  budget,
  spending,
  predict,
  isError,
  isScreenshotMode,
}: TotalCostProps) {
  const { data: session } = useSession();
  const { monthRangeCaption } = useOverviewParamChange();
  const chartRef = useRef(null);
  useChartResizeObserver(chartRef);
  const yourBudget = budget ?? Infinity;
  const currencyInfo = session?.user.currencyInfo;

  const getActualToForecastIndex = () => {
    const currentMonthIdx = getMonth(new Date());
    const allMonths = 12;
    // NOTE: 有 forecasting 值時調整為 const actualToForecastIndex = currentMonthIdx;
    const isCurrentYear = getYear(new Date()).toString() === year;
    const actualToForecastIndex = isCurrentYear ? currentMonthIdx + 1 : allMonths;
    return actualToForecastIndex;
  };

  const actualToForecastIndex = getActualToForecastIndex();

  const yearlyCost = getYearlyCost({ year, spending, predict, actualToForecastIndex });

  const accumulateCost: number[] = yearlyCost.reduce<number[]>((_acc, _cur, _idx) => {
    const copyVal = [..._acc];
    const prevIdx = _idx - 1 >= 0 ? _idx - 1 : 0;
    copyVal[_idx] = (_acc[prevIdx] || 0) + (_cur || 0);
    return copyVal;
  }, []);

  const getMonthStatus = useCallback(
    (monthIdx: number): CostStatusValue => {
      const isForecast = monthIdx >= actualToForecastIndex;
      const isOverspend = accumulateCost[monthIdx] > yourBudget;
      if (isForecast) {
        return isOverspend ? COST_STATUS.FORECAST_OVERSPEND : COST_STATUS.FORECAST_COST;
      } else {
        return isOverspend ? COST_STATUS.OVERSPENT : COST_STATUS.ACTUAL_COST;
      }
    },
    [actualToForecastIndex, accumulateCost, yourBudget]
  );

  const renderTooltip = useCallback(
    (monthIdx: number) => {
      const monthLabel = monthLabels[monthIdx];
      const monthStatus = getMonthStatus(monthIdx);
      const cost = yearlyCost[monthIdx];
      const { name, itemStyle } = costConfig[monthStatus];
      const costData = [
        { label: name, value: cost, itemStyle },
        {
          label: ACCUMULATE_COST,
          value: accumulateCost[monthIdx],
          itemStyle: { color: basicColor.secondary.turquoiseBlue[50] },
        },
      ];
      return renderToString(
        <TotalCostTooltip
          monthLabel={monthLabel}
          costData={costData}
          currencySymbol={currencyInfo?.symbol}
        />
      );
    },
    [yearlyCost, accumulateCost, getMonthStatus, currencyInfo?.symbol]
  );

  const { getTooltipHtml } = useTooltipCache({
    itemCount: 12,
    renderTooltip,
  });

  const maxAccumulatedCost = Math.max(...accumulateCost.filter((v) => v > 0), 0);
  const needsAxisBreak = budget != null && budget > maxAccumulatedCost;
  const axisBreaks = needsAxisBreak
    ? [{ start: maxAccumulatedCost * 0.2, end: budget * 0.995, gap: '12%' }]
    : [];

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      borderWidth: 0,
      backgroundColor: 'transparent',
      padding: 0,
      extraCssText: 'overflow: hidden',
      formatter: (params: TooltipParams[]) => getTooltipHtml(params[0].dataIndex),
    },
    legend: [
      {
        icon: 'rect',
        itemWidth: 16,
        itemHeight: 12,
        data: Object.values([
          ACCUMULATE_COST,
          COST_STATUS.ACTUAL_COST,
          COST_STATUS.OVERSPENT,
          COST_STATUS.FORECAST_COST,
          COST_STATUS.FORECAST_OVERSPEND,
        ]),
        bottom: '5%',
        align: 'left',
        itemStyle: {
          borderWidth: 1,
          borderType: 'dashed',
        },
      },
    ],
    grid: {
      left: '0%',
      right: '3%',
      top: '8%',
      bottom: '25%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: monthLabels,
      axisLabel: {
        color: basicColor.achromatic.gray[90],
      },
    },
    yAxis: {
      type: 'value',
      ...(budget != null && budget > maxAccumulatedCost && { max: budget }),
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => getChartYAxisLabel(value, needsAxisBreak ? 2 : 0),
        color: basicColor.achromatic.gray[90],
      },
      splitLine: {
        lineStyle: {
          color: basicColor.achromatic.gray[10],
          type: 'dashed',
        },
      },
      ...(axisBreaks.length > 0 && {
        breaks: axisBreaks,
        breakArea: { expandOnClick: false },
      }),
    },
    animation: !isScreenshotMode,
    series: [
      // stacked bar chart
      ...Object.values(costConfig).map((_config) => ({
        ..._config,
        type: 'bar',
        stack: 'cost',
        barWidth: '50%',
        data: yearlyCost.map((_cost, _idx) =>
          getMonthStatus(_idx) === _config.name ? _cost : null
        ),
      })),
      // area chart
      {
        name: ACCUMULATE_COST,
        type: 'line',
        data: accumulateCost,
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: basicColor.secondary.turquoiseBlue[30] },
            { offset: 1, color: basicColor.secondary.turquoiseBlue[50] },
          ]),
        },
        itemStyle: {
          color: basicColor.secondary.turquoiseBlue[50], // 指定 ACCUMULATE_COST 的顏色
        },
        lineStyle: { width: 0 },
        symbol: 'none',
        z: 0,
        ...(budget != null && {
          markLine: {
            symbol: 'none',
            lineStyle: {
              type: 'dashed',
              color: costStatusPalette.alert.main,
              width: 1,
            },
            emphasis: {
              lineStyle: { width: 1 },
            },
            label: {
              show: true,
              position: 'insideStartTop',
              formatter: `${LABELS.yourBudget}: ${getChartYAxisLabel(budget, needsAxisBreak ? 2 : 0)}`,
              color: costStatusPalette.alert.main,
              fontWeight: 'bold',
              backgroundColor: alpha(basicColor.achromatic.white, 0.7),
            },
            data: [{ yAxis: budget }],
          },
        }),
      },
    ],
  };

  const isEmpty = spending === null && predict === null;
  const renderContent = () => {
    if (isError) {
      return <EmptyState type="error" {...DEFAULT_EMPTY_CONTENT.errorChart} />;
    }
    if (isEmpty) {
      return <EmptyState type="error" {...DEFAULT_EMPTY_CONTENT.emptyChart} />;
    }
    return (
      <ReactECharts ref={chartRef} option={options} style={{ height: '250px', width: '100%' }} />
    );
  };

  return (
    <Paper sx={{ height: 376, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{LABELS.chartTitle}</Typography>
        <Typography
          color="text.hint"
          sx={{ fontStyle: 'italic' }}
        >{`${LABELS.periodPrefix}: ${monthRangeCaption}`}</Typography>
      </Stack>
      <Typography color="text.hint" variant="caption">
        {!isError && !isEmpty && `${LABELS.costAxisPrefix} (${currencyInfo?.value})`}
      </Typography>
      {renderContent()}
    </Paper>
  );
}
