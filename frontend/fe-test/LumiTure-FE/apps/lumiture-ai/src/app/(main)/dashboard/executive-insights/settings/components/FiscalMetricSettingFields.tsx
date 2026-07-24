'use client';

import type { ReactNode } from 'react';

import { Box, InputAdornment, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { AsteriskRed, HStack, Icon, Markdown, NumberInput, VStack } from '@lumiture-ui';

import type { MonthlyData } from '@hooks-api';

import type { FiscalMetricsFormData } from '../hooks/useFiscalMetricsForm';
import { formatFiscalMonth } from '../utils/formatFiscalMonth';

export type FieldNameType = Omit<
  FiscalMetricsFormData,
  'industryBenchmark' | 'cloudCostPerCustomer' | 'year'
>;

interface FiscalMetricSettingFieldsProps {
  title: string;
  fieldName: keyof FieldNameType;
  isRequired?: boolean;
  tooltipText?: string;
  description?: string;
  withPricePrefix?: boolean;
  getFieldTooltip?: (date: string) => ReactNode;
  headerAction?: ReactNode;
  placeholderData?: MonthlyData;
}

const STYLES = {
  FIELDS_WRAPPER: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    rowGap: 2,
    columnGap: 2,
  },
};

const getPlaceholder = (value?: number | null) => (value == null ? '--' : String(value));

export function FiscalMetricSettingFields({
  title,
  fieldName,
  tooltipText,
  description,
  isRequired = false,
  withPricePrefix = false,
  getFieldTooltip,
  headerAction,
  placeholderData,
}: FiscalMetricSettingFieldsProps) {
  const { control } = useFormContext<FieldNameType>();
  const fieldValue = useWatch({ control, name: fieldName });
  const fieldEntries = Object.entries(fieldValue ?? {});

  return (
    <VStack sx={{ gap: 2 }}>
      <HStack sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <HStack sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="bodyBold">{title}</Typography>
          {isRequired && <AsteriskRed />}
          {tooltipText && (
            <Tooltip title={<Markdown>{tooltipText}</Markdown>} placement="top">
              <Box display="flex" alignItems="center" justifyContent="center">
                <Icon name="info" sx={{ fontSize: 16, color: 'text.hint' }} />
              </Box>
            </Tooltip>
          )}
        </HStack>
        {headerAction}
      </HStack>
      {description && (
        <Typography variant="caption" color="text.secondary">
          <Markdown components={{ p: 'span' }}>{description}</Markdown>
        </Typography>
      )}
      <Box sx={STYLES.FIELDS_WRAPPER}>
        {fieldEntries.map(([date]) => (
          <Controller
            key={date}
            name={`${fieldName}.${date}`}
            control={control}
            render={({ field, fieldState }) => {
              const numberInput = (
                <NumberInput
                  {...field}
                  id={field.name}
                  value={field.value ?? ''}
                  placeholder={placeholderData ? getPlaceholder(placeholderData[date]) : undefined}
                  label={formatFiscalMonth(new Date(date))}
                  slotProps={{
                    input: {
                      startAdornment: withPricePrefix && (
                        <InputAdornment position="start" sx={{ '& p': { lineHeight: 1 } }}>
                          $
                        </InputAdornment>
                      ),
                    },
                  }}
                  decimalPlaces={2}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              );

              const fieldTooltip = getFieldTooltip?.(date);
              if (!fieldTooltip) return numberInput;

              return (
                <Tooltip
                  title={fieldTooltip}
                  placement="bottom-start"
                  disableHoverListener
                  disableTouchListener
                >
                  {numberInput}
                </Tooltip>
              );
            }}
          />
        ))}
      </Box>
    </VStack>
  );
}
