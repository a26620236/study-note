import { Paper, Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { FiscalMetricSettingFields } from './FiscalMetricSettingFields';
import { FiscalMetricsSettingsCostPerActiveCustomerField } from './FiscalMetricsSettingsCostPerActiveCustomerField';

const LABELS = {
  title: 'Cloud Cost per Customer',
  fields: {
    activeCustomers: {
      title: 'Active Customers',
      description: `Enter the number of active customers for each month. If a month is left blank, that month's value will not appear in the trend chart.`,
    },
  },
};

export function FiscalMetricsSettingsCloudCostPerCustomerSection() {
  return (
    <Paper sx={{ p: 6 }}>
      <VStack sx={{ gap: 4 }}>
        <Typography variant="h5">{LABELS.title}</Typography>
        <FiscalMetricsSettingsCostPerActiveCustomerField />
        <FiscalMetricSettingFields
          fieldName="activeCustomers"
          title={LABELS.fields.activeCustomers.title}
          description={LABELS.fields.activeCustomers.description}
        />
      </VStack>
    </Paper>
  );
}
