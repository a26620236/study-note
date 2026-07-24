'use client';

import type { ReactNode } from 'react';

import { InputAdornment } from '@mui/material';
import { Controller, useFormContext, type Path } from 'react-hook-form';

import { NumberInput, type NumberInputProps } from '@lumiture-ui';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';

type VirtualMachineNumberInputFieldProps = NumberInputProps & {
  fieldName: Path<RightsizingSettingsFormData>;
  withPercentEndAdornment?: boolean;
  width?: number;
  placeholder?: ReactNode;
  disabled?: boolean;
};

export function VirtualMachineNumberInputField({
  fieldName,
  withPercentEndAdornment = false,
  width = 220,
  placeholder,
  disabled,
}: VirtualMachineNumberInputFieldProps) {
  const { control, trigger } = useFormContext<RightsizingSettingsFormData>();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => (
        <NumberInput
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            field.onChange(e);
            trigger(fieldName);
          }}
          id={field.name}
          value={field.value}
          allowFloat={false}
          sx={{
            width,
          }}
          slotProps={{
            input: {
              endAdornment: withPercentEndAdornment ? (
                <InputAdornment position="end">%</InputAdornment>
              ) : undefined,
            },
          }}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
