'use client';

import { Box, InputAdornment, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { AsteriskRed, HStack, Icon, Markdown, NumberInput, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import type { FiscalMetricsFormData } from '../hooks/useFiscalMetricsForm';

const STYLES = {
  WRAPPER: {
    p: 4,
    border: `1px solid ${theme.palette.gray.borderLight}`,
    borderRadius: '8px',
    backgroundColor: theme.palette.primary.light10,
  },
};

const LABELS = {
  title: 'Cloud Cost per Active Customer',
  description: `Currency in **USD**. This represents the standard of comparing **Cloud Cost Per Customer**. Please refer to your past data or experience.`,
  helperText: '<u><em>**Calculated as: Total Cloud Cost ÷ Active Customers.**</em></u>',
  explanation: 'Calculated as: Total Cloud Cost ÷ Active Customers.',
  tooltipText:
    '**Cloud Cost per Active Customer** is calculated as: <u><em>Monthly cloud cost ÷ Monthly active customer count</em></u>',
};

export function FiscalMetricsSettingsCostPerActiveCustomerField() {
  const { control } = useFormContext<FiscalMetricsFormData>();

  return (
    <Box sx={STYLES.WRAPPER}>
      <VStack sx={{ gap: 2 }}>
        <HStack sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="bodyBold">{LABELS.title}</Typography>
          <AsteriskRed />
          <Tooltip title={<Markdown>{LABELS.tooltipText}</Markdown>} placement="top">
            <Box display="flex" alignItems="center" justifyContent="center">
              <Icon name="info" sx={{ fontSize: 16, color: 'text.hint' }} />
            </Box>
          </Tooltip>
        </HStack>
        <Typography variant="caption" color="text.secondary">
          <Markdown components={{ p: 'span' }}>{LABELS.description}</Markdown>
        </Typography>
        <Controller
          name="cloudCostPerCustomer"
          control={control}
          render={({ field, fieldState }) => (
            <NumberInput
              {...field}
              id={field.name}
              value={field.value || ''}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              decimalPlaces={2}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              sx={{ width: '340px' }}
            />
          )}
        />
        <Typography
          variant="captionBold"
          color="text.secondary"
          sx={{ fontStyle: 'italic', textDecoration: 'underline' }}
        >
          {LABELS.explanation}
        </Typography>
      </VStack>
    </Box>
  );
}
