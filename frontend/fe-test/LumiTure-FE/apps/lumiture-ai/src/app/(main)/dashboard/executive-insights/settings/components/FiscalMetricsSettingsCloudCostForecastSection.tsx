'use client';

import { Paper, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';

import { HStack, VStack } from '@lumiture-ui';
import { getIsEmptyValue } from '@shared/utils';

import { CompletionChip } from '@components/Chip';

import type { FiscalMetricsFormData } from '../hooks/useFiscalMetricsForm';
import { FiscalMetricSettingFields } from './FiscalMetricSettingFields';

function CostForecastCompletionChip() {
  const { control } = useFormContext<FiscalMetricsFormData>();
  const costForecast = useWatch({ control, name: 'costForecast' });

  const completed = !!costForecast && !Object.values(costForecast).some(getIsEmptyValue);

  return <CompletionChip completed={completed} />;
}

const LABELS = {
  title: 'Cloud Cost Forecast & Variance',
  fields: {
    costForecast: {
      title: 'Monthly Cost Forecast',
      description:
        'Enter your forecasted monthly cloud spend. Currency in **USD**.<br/>This is compared with Actual Cost to calculate **Variance and Variance %**. Leave blank if no forecast is available.',
    },
  },
};

export function FiscalMetricsSettingsCloudCostForecastSection() {
  return (
    <Paper sx={{ p: 6 }}>
      <VStack sx={{ gap: 4 }}>
        <HStack sx={{ alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">{LABELS.title}</Typography>
          <CostForecastCompletionChip />
        </HStack>
        <FiscalMetricSettingFields
          fieldName="costForecast"
          title={LABELS.fields.costForecast.title}
          description={LABELS.fields.costForecast.description}
          withPricePrefix
        />
      </VStack>
    </Paper>
  );
}
