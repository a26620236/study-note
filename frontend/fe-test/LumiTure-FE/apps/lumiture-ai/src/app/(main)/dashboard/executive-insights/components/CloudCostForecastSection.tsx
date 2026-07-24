import { Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { useGetFiscalReportQuery } from '../hooks/useGetFiscalReportQuery';
import { getEndPeriod } from '../utils/getEndPeriod';
import { CloudCostVarianceCard } from './CloudCostVarianceCard';
import { MetricDisplay } from './MetricDisplay';

const LABELS = {
  title: 'Cloud Cost Forecast & Variance',
  forecast: 'Your Forecast',
  actualCost: 'Actual Cost',
  variance: 'Variance',
  variancePercent: 'Variance Percent',
  description:
    '<strong>Variance</strong> is calculated as: <br/><u><em>Forecast - Actual Cost</em></u>',
};

export function CloudCostForecastSection() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { costForecastVariance, currency, period } = fiscalReport?.data ?? {};
  const { forecast, actualCost, variance, variancePercent } = costForecastVariance ?? {};

  return (
    <Paper sx={{ padding: '24px', flex: 1 }}>
      <VStack gap={2}>
        <Typography variant="h5">{LABELS.title}</Typography>
        <Typography variant="body2" color="text.hint" sx={{ fontStyle: 'italic' }}>
          {getEndPeriod(period?.end)}
        </Typography>
        <CloudCostVarianceCard variancePercent={variancePercent} />
        <HStack flexWrap="nowrap" justifyContent="space-between" gap={2}>
          <MetricDisplay
            title={LABELS.forecast}
            numberFormatProps={{ num: forecast }}
            currency={currency}
          />
          <MetricDisplay
            title={LABELS.actualCost}
            numberFormatProps={{ num: actualCost }}
            currency={currency}
          />
          <MetricDisplay
            title={LABELS.variance}
            numberFormatProps={{ num: variance }}
            currency={currency}
            description={LABELS.description}
          />
        </HStack>
      </VStack>
    </Paper>
  );
}
