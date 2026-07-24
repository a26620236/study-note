'use client';

import { Typography } from '@mui/material';
import { format } from 'date-fns';

import { HStack, VStack } from '@lumiture-ui';

import type { Currency } from '@constants';

import { MetricDisplay } from '../MetricDisplay';

interface CVRMetricsProps {
  financialBudget?: number | null;
  expectedRoi?: number | null;
  expectedValue?: number | null;
  actualCost?: number | null;
  realizedValue?: number | null;
  costVariance?: number | null;
  currency?: Currency;
  endDate?: string;
}

const LABELS = {
  metric: {
    ytdBudget: 'YTD Budget',
    expectedRoi: 'Expected ROI',
    expectedValue: 'Expected Value',
    ytdActualCost: 'YTD Actual Cost',
    realizedValue: 'Realized Value',
    costVariance: 'Cost Variance',
  },
  metricDescription: {
    expectedValue:
      '<strong>Expected Value</strong> is calculated as: <br/><u><em>Financial Budget x Expected ROI</em></u>',
    realizedValue:
      '<strong>Realized Value</strong> represents the tangible business benefits derived from the consumption of cloud services, indicating the progress made toward achieving strategic goals.',
    costVariance: 'The cost variance for the current fiscal year.',
  },
};

export function CVRMetrics({
  financialBudget,
  expectedRoi,
  expectedValue,
  actualCost,
  realizedValue,
  costVariance,
  currency,
  endDate,
}: CVRMetricsProps) {
  return (
    <VStack sx={{ padding: '16px', flexWrap: 'nowrap' }}>
      <HStack sx={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
        <MetricDisplay
          title={LABELS.metric.ytdBudget}
          numberFormatProps={{ num: financialBudget }}
          currency={currency}
        />
        <MetricDisplay
          title={
            <HStack sx={{ flexWrap: 'nowrap', alignItems: 'center', gap: 1 }}>
              {LABELS.metric.expectedRoi}
              <Typography color="text.hint" variant="captionBold">
                {endDate ? `(${format(new Date(endDate), 'MMM.')})` : '--'}
              </Typography>
            </HStack>
          }
          numberFormatProps={{ num: expectedRoi }}
        />
        <MetricDisplay
          title={LABELS.metric.expectedValue}
          numberFormatProps={{ num: expectedValue }}
          currency={currency}
          description={LABELS.metricDescription.expectedValue}
        />
      </HStack>

      <HStack sx={{ flexWrap: 'nowrap', justifyContent: 'space-between' }}>
        <MetricDisplay
          title={LABELS.metric.ytdActualCost}
          numberFormatProps={{ num: actualCost }}
          currency={currency}
        />
        <MetricDisplay
          title={LABELS.metric.realizedValue}
          numberFormatProps={{ num: realizedValue }}
          currency={currency}
          description={LABELS.metricDescription.realizedValue}
        />
        <MetricDisplay
          title={LABELS.metric.costVariance}
          numberFormatProps={{ num: costVariance }}
          currency={currency}
          description={LABELS.metricDescription.costVariance}
        />
      </HStack>
    </VStack>
  );
}
