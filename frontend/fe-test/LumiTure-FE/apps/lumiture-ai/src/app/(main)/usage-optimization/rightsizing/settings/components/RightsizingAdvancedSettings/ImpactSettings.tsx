import { useMemo } from 'react';

import { Typography, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { HStack, Markdown, SingleSelect, VStack } from '@lumiture-ui';

import { ImpactSettingTypeEnum } from '@hooks-api';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';
import { ThresholdInputField } from './ThresholdInputField';

const LABELS = {
  title: 'Impact Settings',
  description:
    'Define the criteria for recommendation impact. If the Impact Type is selected as "Amount," the currency will be automatically set to <strong>USD.</strong>',
  impactCriteriaType: {
    title: 'Impact Criteria Type',
    value: {
      [ImpactSettingTypeEnum.Percentage]: 'Percentage (%)',
      [ImpactSettingTypeEnum.Amount]: 'Amount',
    },
  },
  threshold: {
    high: {
      title: 'High Threshold',
      tooltipText: 'Above the medium threshold, e.g., 30.',
    },
    medium: {
      title: 'Medium Threshold',
      tooltipText: 'Between the high and Low thresholds, e.g., 15.',
    },
    low: {
      title: 'Low Threshold',
      tooltipText: 'Below the medium threshold, e.g., 5.',
    },
  },
};

export function ImpactSettings() {
  const { control, watch, setValue, clearErrors } = useFormContext<RightsizingSettingsFormData>();
  const theme = useTheme();
  const isPercentage = watch('advance.impact.type') === ImpactSettingTypeEnum.Percentage;

  const impactCriteriaTypeOptions = useMemo(
    () =>
      Object.values(ImpactSettingTypeEnum).map((type) => ({
        id: type,
        name: LABELS.impactCriteriaType.value[type],
      })),
    []
  );

  return (
    <VStack sx={{ gap: 4 }}>
      <Typography variant="h6" color="text.secondary">
        {LABELS.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        <Markdown>{LABELS.description}</Markdown>
      </Typography>
      <VStack
        sx={{
          padding: 4,
          gap: 4,
          backgroundColor: theme.palette.primary.light10,
          borderRadius: '8px',
        }}
      >
        <Controller
          name="advance.impact.type"
          control={control}
          render={({ field }) => (
            <SingleSelect
              label={LABELS.impactCriteriaType.title}
              configKey={field.name}
              ref={field.ref}
              value={field.value}
              options={impactCriteriaTypeOptions}
              onChange={({ value }) => {
                field.onChange(value);
                /**
                 * When the type is switched, clear all threshold values and errors
                 */
                setValue('advance.impact.threshold.high', '', { shouldDirty: true });
                setValue('advance.impact.threshold.medium', '', { shouldDirty: true });
                setValue('advance.impact.threshold.low', '', { shouldDirty: true });
                clearErrors('advance.impact');
              }}
              sx={{ width: '360px' }}
            />
          )}
        />
        <HStack sx={{ gap: 4 }}>
          <ThresholdInputField
            fieldName="advance.impact.threshold.high"
            label={LABELS.threshold.high.title}
            tooltipText={LABELS.threshold.high.tooltipText}
            isPercentage={isPercentage}
          />
          <ThresholdInputField
            fieldName="advance.impact.threshold.medium"
            label={LABELS.threshold.medium.title}
            tooltipText={LABELS.threshold.medium.tooltipText}
            isPercentage={isPercentage}
          />
          <ThresholdInputField
            fieldName="advance.impact.threshold.low"
            label={LABELS.threshold.low.title}
            tooltipText={LABELS.threshold.low.tooltipText}
            isPercentage={isPercentage}
          />
        </HStack>
      </VStack>
    </VStack>
  );
}
