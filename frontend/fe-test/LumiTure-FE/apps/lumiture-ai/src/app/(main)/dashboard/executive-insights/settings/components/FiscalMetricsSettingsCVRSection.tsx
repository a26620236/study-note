'use client';

import { useSearchParams } from 'next/navigation';

import { Button, Paper, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { getIsEmptyValue } from '@shared/utils';

import { CompletionChip } from '@components/Chip';
import { useGetFiscalMetricsSettings } from '@hooks-api';

import type { FiscalMetricsFormData } from '../hooks/useFiscalMetricsForm';
import { FiscalMetricSettingFields } from './FiscalMetricSettingFields';

function CVRCompletionChip() {
  const { control } = useFormContext<FiscalMetricsFormData>();
  const [financialBudget, expectedRoi] = useWatch({
    control,
    name: ['financialBudget', 'expectedRoi'],
  });

  const completed = !(
    (financialBudget && Object.values(financialBudget).some(getIsEmptyValue)) ||
    (expectedRoi && Object.values(expectedRoi).some(getIsEmptyValue))
  );

  return <CompletionChip completed={completed} />;
}

const LABELS = {
  title: 'Cloud Value Realization',
  syncFromGeneralBudget: 'Sync all from General Budget',
  fields: {
    financialBudget: {
      title: 'Estimated Financial Budget',
      description:
        "Enter your organization's forward-looking monthly budget from a company-wide perspective. Currency in **USD**. **Edits here won't affect your General Budget.**",
      tooltipText: `A forward-looking estimate of your monthly cloud budget. **Pre-filled from General Budget monthly totals, but edits stay here only and won't affect the source.** Use this to reflect your actual planned spending from a company-wide perspective, even if team budgets are incomplete or include buffers.`,
      unableToRetrieve: 'Unable to retrieve data from General Budget.',
      prefilledFromGeneralBudget: (value: number) => `Pre-filled from General Budget: $${value}`,
    },
    expectedRoi: {
      title: 'Expected ROI',
      description:
        'Enter the expected return on investment for each month. This is how much value you expect to realize for every $1 spent on cloud. ',
    },
  },
};

export function FiscalMetricsSettingsCVRSection() {
  const searchParams = useSearchParams();
  const fiscalYearParam = searchParams.get('year');

  const { getValues, setValue } = useFormContext<FiscalMetricsFormData>();

  const { data } = useGetFiscalMetricsSettings(fiscalYearParam);
  const generalBudget = data?.data.generalBudget;

  const handleSyncFromGeneralBudget = () => {
    if (!generalBudget) return;

    const currentFinancialBudget = getValues('financialBudget') ?? {};
    Object.keys(currentFinancialBudget).forEach((month) => {
      setValue(`financialBudget.${month}`, generalBudget[month] ?? '', {
        shouldDirty: true,
        shouldValidate: false,
      });
    });
  };

  return (
    <Paper sx={{ p: 6 }}>
      <VStack sx={{ gap: 4 }}>
        <HStack sx={{ alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">{LABELS.title}</Typography>
          <CVRCompletionChip />
        </HStack>
        <FiscalMetricSettingFields
          fieldName="financialBudget"
          title={LABELS.fields.financialBudget.title}
          tooltipText={LABELS.fields.financialBudget.tooltipText}
          description={LABELS.fields.financialBudget.description}
          isRequired
          withPricePrefix
          placeholderData={generalBudget}
          getFieldTooltip={(date) => {
            const value = generalBudget?.[date];
            return value == null
              ? LABELS.fields.financialBudget.unableToRetrieve
              : LABELS.fields.financialBudget.prefilledFromGeneralBudget(value);
          }}
          headerAction={
            <Button
              variant="link"
              size="small"
              startIcon={<Icon name="sync" />}
              onClick={handleSyncFromGeneralBudget}
              disabled={!generalBudget}
            >
              <Typography variant="bodyBold">{LABELS.syncFromGeneralBudget}</Typography>
            </Button>
          }
        />
        <FiscalMetricSettingFields
          fieldName="expectedRoi"
          title={LABELS.fields.expectedRoi.title}
          description={LABELS.fields.expectedRoi.description}
          isRequired
        />
      </VStack>
    </Paper>
  );
}
