'use client';

import { Box, Paper, Typography } from '@mui/material';
import { format, getYear } from 'date-fns';

import { HStack, Icon, VStack } from '@lumiture-ui';

import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { CVRMetrics } from './CVRMetrics';
import { CVRMetricsChart } from './CVRMetricsChart';
import { CVRScoreCard } from './CVRScoreCard';

const LABELS = {
  title: 'Cloud Value Realization (CVR)',
  getPeriod: (period: string) => `Viewing: ${period}`,
  getFiscalStartMonth: (fiscalStartMonth: string) => `Fiscal Year Start: ${fiscalStartMonth}`,
};

const getFinancialPeriod = ({
  start,
  end,
}: {
  start: string | undefined;
  end: string | undefined;
}) => {
  if (!start || !end) {
    return '--';
  }

  const fiscalYear = `FY${getYear(new Date(start))}`;
  const startFormatted = format(new Date(start), 'MMM. yyyy');
  const endFormatted = format(new Date(end), 'MMM. yyyy');
  const period = `${fiscalYear} · ${startFormatted} - ${endFormatted}`;

  return LABELS.getPeriod(period);
};

export function CVRSection() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { cloudValueRealization, currency, period } = fiscalReport?.data ?? {};
  const { start, end } = period ?? {};
  const {
    cvrScore,
    financialBudget,
    expectedRoi,
    expectedValue,
    actualCost,
    realizedValue,
    costVariance,
    trendChart,
  } = cloudValueRealization ?? {};

  const financialPeriod = getFinancialPeriod({ start, end });
  const fiscalStartMonth = period?.start ? format(new Date(period.start), 'MMMM') : '--';

  return (
    <Paper>
      <VStack>
        <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{LABELS.title}</Typography>
          <Typography
            variant="bodyBold"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Icon name="calendar_clock" sx={{ fontSize: 16 }} />
            {LABELS.getFiscalStartMonth(fiscalStartMonth)}
          </Typography>
        </HStack>
        <Typography variant="bodyMedium" color="text.hint" sx={{ mt: '5px', fontStyle: 'italic' }}>
          {financialPeriod}
        </Typography>

        <HStack sx={{ mt: 4, flexWrap: 'nowrap' }}>
          <VStack sx={{ flex: 1 }}>
            <CVRScoreCard score={cvrScore} />
            <CVRMetrics
              financialBudget={financialBudget}
              expectedRoi={expectedRoi}
              expectedValue={expectedValue}
              actualCost={actualCost}
              realizedValue={realizedValue}
              costVariance={costVariance}
              currency={currency}
              endDate={period?.end}
            />
          </VStack>
          <Box sx={{ flex: 1 }}>
            <CVRMetricsChart data={trendChart} />
          </Box>
        </HStack>
      </VStack>
    </Paper>
  );
}
