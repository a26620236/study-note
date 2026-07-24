import { Paper, Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { FiscalMetricSettingFields } from './FiscalMetricSettingFields';
import { FiscalMetricsSettingsIndustryBenchmarkField } from './FiscalMetricsSettingsIndustryBenchmarkField';

const LABELS = {
  title: 'Cloud Spend as a % of Revenue',
  fields: {
    revenue: {
      title: 'Revenue',
      description: 'Enter your monthly revenue. Currency in **USD**.',
    },
  },
};

export function FiscalMetricsSettingsCloudSpendRevenueSection() {
  return (
    <Paper sx={{ p: 6 }}>
      <VStack sx={{ gap: 4 }}>
        <Typography variant="h5">{LABELS.title}</Typography>
        <FiscalMetricsSettingsIndustryBenchmarkField />
        <FiscalMetricSettingFields
          fieldName="revenue"
          title={LABELS.fields.revenue.title}
          description={LABELS.fields.revenue.description}
          withPricePrefix
        />
      </VStack>
    </Paper>
  );
}
