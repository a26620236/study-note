import React from 'react';

import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Icon } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import { FORM_ID } from '@app/(main)/budget/customized/components/constants';
import type { CustomBudgetForm } from '@app/(main)/budget/customized/components/types';

interface ThresholdInputProps {
  autoFocusIndex: null | number;
}

const ThresholdInput = ({ autoFocusIndex }: ThresholdInputProps) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CustomBudgetForm>();
  const thresholds = useWatch({ control, name: FORM_ID.THRESHOLDS });
  const budgetAmount = useWatch({ control, name: FORM_ID.AMOUNT });

  const handleDeleteThreshold = (index: number) => () => {
    setValue(FORM_ID.THRESHOLDS, thresholds.filter((_, i) => i !== index).map(Number));
  };

  const getError = (index: number) => errors[FORM_ID.THRESHOLDS]?.[index]?.message;

  const handleChange =
    (onChange: (...event: unknown[]) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/\D/gu, '');

      const value = inputValue === '' ? null : +inputValue;

      onChange(value);
    };

  return (
    <Stack sx={{ gap: 4 }}>
      {thresholds.map((_, index) => {
        const errMsg = getError(index);
        const percentage = thresholds[index] ?? 0;
        const thresholdBudgetAmount = percentage * (budgetAmount / 100);

        return (
          <Stack key={index}>
            <Stack direction="row" alignItems="center" sx={{ gap: 4 }}>
              <Stack direction="row" alignItems="center" sx={{ width: 216, gap: 4 }}>
                <Controller
                  name={`${FORM_ID.THRESHOLDS}.${index}`}
                  control={control}
                  render={({ field: { ref, value, onChange, ...others } }) => (
                    <TextField
                      {...others}
                      value={value ?? ''}
                      inputRef={ref}
                      // 新增 threshold 時，自動 focus 新增的 field
                      autoFocus={autoFocusIndex === index}
                      onChange={handleChange(onChange)}
                      error={!!errMsg}
                      slotProps={{
                        htmlInput: { inputMode: 'numeric' },
                        input: {
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        },
                      }}
                    />
                  )}
                />
                <Typography>=</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" sx={{ flex: 1, gap: 2 }}>
                <Typography>{`USD ${nFormatter({ num: thresholdBudgetAmount, fixed: 2 })}`}</Typography>
                <Tooltip title="Remove threshold" placement="top">
                  <IconButton
                    size="small"
                    aria-label="delete threshold cell"
                    onClick={handleDeleteThreshold(index)}
                    disabled={thresholds.length <= 1}
                    sx={{ ml: 'auto' }}
                  >
                    <Icon name="delete" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ThresholdInput;
