import { Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { useGetFiscalReportQuery } from '../hooks/useGetFiscalReportQuery';
import { getEndPeriod } from '../utils/getEndPeriod';
import { CloudSpendRevenueCard } from './CloudSpendRevenueCard';
import { MetricDisplay } from './MetricDisplay';

const LABELS = {
  title: 'Cloud Spend as a % of Revenue',
  revenue: 'Revenue',
  industryBenchmark: 'Industry Benchmark',
};

export function CloudSpendRevenueSection() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { cloudSpendToRevenue, currency, period } = fiscalReport?.data ?? {};
  const { value, industryBenchmark, revenue } = cloudSpendToRevenue ?? {};

  return (
    <Paper sx={{ padding: '24px', flex: 1 }}>
      <VStack gap={2}>
        <Typography variant="h5">{LABELS.title}</Typography>
        <Typography variant="body2" color="text.hint" sx={{ fontStyle: 'italic' }}>
          {getEndPeriod(period?.end)}
        </Typography>
        <CloudSpendRevenueCard percentage={value} benchmark={industryBenchmark} />
        <HStack gap={4} flexWrap="nowrap">
          <MetricDisplay
            title={LABELS.revenue}
            numberFormatProps={{ num: revenue }}
            currency={currency}
          />
          <MetricDisplay
            title={LABELS.industryBenchmark}
            numberFormatProps={{
              num: industryBenchmark,
              suffix: '%',
              fixed: 0,
            }}
          />
        </HStack>
      </VStack>
    </Paper>
  );
}
