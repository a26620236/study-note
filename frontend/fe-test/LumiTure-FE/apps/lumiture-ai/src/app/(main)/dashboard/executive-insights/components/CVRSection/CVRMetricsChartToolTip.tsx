import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format, getYear } from 'date-fns';

import { VStack } from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';

import TooltipItem from '@app/(main)/components/TooltipItem';
import type { CurrencySymbol } from '@constants';

interface TrendChartData {
  date: string[];
  expectedValues: number[];
  realizedValues: number[];
  actualCosts: number[];
}

interface CVRMetricsChartToolTipProps {
  index: number;
  data?: TrendChartData;
  currencySymbol?: CurrencySymbol;
}

const LABELS = {
  expectedValue: 'Expected Value',
  realizedValue: 'Realized Value',
  actualCost: 'Actual Cost',
};

const TOOLTIP_STYLES = {
  WRAPPER: {
    width: '240px',
    gap: 8,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  TITLE: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: theme.palette.text.primary,
  },
  LIST: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  DIVIDER: {
    height: 1,
    backgroundColor: theme.palette.gray.selected,
  },
} as const;

const SERIES = [
  {
    key: 'expectedValues',
    label: LABELS.expectedValue,
    color: basicColor.secondary.turquoiseBlue[70],
    markType: 'dash',
  },
  {
    key: 'realizedValues',
    label: LABELS.realizedValue,
    color: theme.palette.colorKit.dark[5],
    markType: 'line',
  },
  {
    key: 'actualCosts',
    label: LABELS.actualCost,
    color: theme.palette.colorKit.dark[1],
    markType: 'line',
  },
] as const;

export function CVRMetricsChartToolTip({
  index,
  data,
  currencySymbol,
}: CVRMetricsChartToolTipProps) {
  const year = data?.date[index] ? getYear(new Date(data.date[index])) : '--';
  const month = data?.date[index] ? format(new Date(data.date[index]), 'MMM.') : '--';

  return (
    <VStack style={TOOLTIP_STYLES.WRAPPER}>
      <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
        {`${month} ${year}`}
      </Typography>
      <Box style={TOOLTIP_STYLES.DIVIDER} />
      <VStack style={TOOLTIP_STYLES.LIST}>
        {SERIES.map((series) => (
          <Box key={series.key}>
            <TooltipItem
              label={series.label}
              value={data?.[series.key][index] ?? 0}
              currencySymbol={currencySymbol}
              color={series.color}
              markType={series.markType}
            />
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
