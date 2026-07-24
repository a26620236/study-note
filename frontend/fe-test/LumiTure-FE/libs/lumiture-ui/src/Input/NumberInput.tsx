'use client';

import { forwardRef, useCallback, type ChangeEvent } from 'react';

import { TextField, Typography, type TextFieldProps } from '@mui/material';

import { InputLabel } from './InputLabel';

export type NumberInputProps = TextFieldProps & {
  allowFloat?: boolean;
  decimalPlaces?: number;
  label?: React.ReactNode;
  required?: boolean;
  tooltipText?: React.ReactNode;
};

const VALID_INTEGER_PATTERN = /^[0-9]*$/u;
const VALID_FLOAT_PATTERN = /^[0-9]+\.?[0-9]*$/u;

const getValidPattern = (allowFloat: boolean, decimalPlaces?: number): RegExp => {
  if (!allowFloat) {
    return VALID_INTEGER_PATTERN;
  }

  if (!decimalPlaces) {
    return VALID_FLOAT_PATTERN;
  }

  // Allow only the specified number of decimal places
  return new RegExp(`^[0-9]+\\.?[0-9]{0,${decimalPlaces}}$`, 'u');
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    allowFloat = true,
    decimalPlaces,
    onChange,
    slotProps,
    id,
    label,
    required,
    tooltipText,
    ...inputProps
  }: NumberInputProps,
  ref
) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const pattern = getValidPattern(allowFloat, decimalPlaces);

      if (value === '' || pattern.test(value)) {
        onChange?.(e);
      } else {
        const correctedValue = value.slice(0, -1);
        const syntheticEvent: ChangeEvent<HTMLInputElement> = {
          ...e,
          target: {
            ...e.target,
            value: correctedValue,
          },
          currentTarget: {
            ...e.currentTarget,
            value: correctedValue,
          },
        };
        onChange?.(syntheticEvent);
      }
    },
    [onChange, allowFloat, decimalPlaces]
  );

  const TextFieldLabel = () => (
    <InputLabel
      label={<Typography variant="buttonBold1">{label}</Typography>}
      required={required}
      tooltipText={tooltipText}
    />
  );

  return (
    <TextField
      id={id}
      label={label ? <TextFieldLabel /> : undefined}
      onChange={handleChange}
      slotProps={slotProps}
      ref={ref}
      {...inputProps}
    />
  );
});
