import type { ReactNode } from 'react';

import { InputAdornment } from '@mui/material';
import { Controller, useFormContext, type Path } from 'react-hook-form';

import { NumberInput } from '@lumiture-ui';

import { Currency } from '@constants';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';

interface ThresholdInputFieldProps {
  fieldName: Path<RightsizingSettingsFormData>;
  label: ReactNode;
  tooltipText: ReactNode;
  isPercentage: boolean;
}

export function ThresholdInputField({
  fieldName,
  label,
  tooltipText,
  isPercentage,
}: ThresholdInputFieldProps) {
  const { control, trigger } = useFormContext<RightsizingSettingsFormData>();
  const inputAdornment = isPercentage
    ? {
        endAdornment: (
          <InputAdornment position="end" sx={{ '& p': { lineHeight: 1 } }}>
            %
          </InputAdornment>
        ),
      }
    : {
        startAdornment: (
          <InputAdornment position="start" sx={{ '& p': { lineHeight: 1 } }}>
            {Currency.USD}
          </InputAdornment>
        ),
      };

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => (
        <NumberInput
          {...field}
          id={field.name}
          value={field.value}
          onChange={(e) => {
            field.onChange(e);
            trigger('advance.impact.threshold');
          }}
          label={label}
          required
          sx={{ flex: 1 }}
          allowFloat={false}
          slotProps={{
            input: inputAdornment,
          }}
          tooltipText={tooltipText}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
