import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext } from 'react-hook-form';

import { CREDIT_OPTIONS, FORM_ID } from '@app/(main)/budget/customized/components/constants';
import MonitoringPeriodForm from '@app/(main)/budget/customized/components/MonitoringPeriodForm';
import type { CustomBudgetForm } from '@app/(main)/budget/customized/components/types';

interface BudgetSettingsFormProps {
  isBatchMode: boolean;
  isEditing: boolean;
}

const BudgetSettingsForm = ({ isBatchMode, isEditing }: BudgetSettingsFormProps) => {
  const { control, trigger } = useFormContext<CustomBudgetForm>();

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: unknown[]) => void
  ) => {
    const inputValue = e.target.value;
    // only allow number input
    if (/^\d*$/u.test(inputValue)) {
      const value = inputValue === '' ? undefined : +inputValue;
      // limit maximum value to 99999
      if (value === undefined || value <= 99999999) {
        onChange(value);
        trigger(FORM_ID.AMOUNT);
      }
    }
  };

  return (
    <>
      <Controller
        name={FORM_ID.NAME}
        control={control}
        render={({ field, fieldState }) => (
          <Stack sx={{ gap: 2 }}>
            <TextField
              {...field}
              required
              label="Budget Name"
              size="small"
              placeholder="Please give your customized budget a name."
              error={fieldState.invalid}
              helperText={fieldState.error?.message ?? ''}
            />
            {isBatchMode && (
              <Typography variant="caption" color="text.secondary">
                This name will be <b>prefixed</b> to the selected group or resource name. For
                example: Monthly Budget_Group A.
              </Typography>
            )}
          </Stack>
        )}
      />

      <Stack sx={{ gap: 8 }}>
        <MonitoringPeriodForm disabled={isEditing} />
        <Controller
          name={FORM_ID.AMOUNT}
          control={control}
          render={({ field, fieldState }) => (
            <Stack sx={{ gap: 2 }}>
              <TextField
                {...field}
                required
                size="small"
                label="Budget Amount"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAmountChange(e, field.onChange)
                }
                value={field.value}
                error={fieldState.invalid}
                helperText={fieldState.error?.message ?? ''}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                  },
                  inputLabel: {
                    style: { textTransform: 'capitalize' },
                  },
                }}
              />
              {!isBatchMode && (
                <Typography variant="caption" color="text.secondary">
                  This budget covers costs meeting the <b>cost calculation rules</b> you&apos;ve set
                  below.
                </Typography>
              )}
            </Stack>
          )}
        />
      </Stack>

      <FormControl>
        <InputLabel size="small">Include Credit</InputLabel>
        <Controller
          name={FORM_ID.CREDIT}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value={String(field.value)}
              onChange={(e) => {
                const value = e.target.value === 'true';
                field.onChange(value);
              }}
            >
              {CREDIT_OPTIONS.map((_option) => (
                <MenuItem key={_option.label} value={String(_option.value)}>
                  {_option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </>
  );
};

export default BudgetSettingsForm;
