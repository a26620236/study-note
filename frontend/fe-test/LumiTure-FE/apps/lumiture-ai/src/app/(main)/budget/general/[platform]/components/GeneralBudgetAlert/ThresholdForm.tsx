import type { ChangeEvent } from 'react';

import {
  FormHelperText,
  IconButton,
  InputAdornment,
  InputBase,
  Tooltip,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash-es';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { FORM_ID, MAXIMUM_THRESHOLDS } from '../../constants/generalAlert';
import type { FormGeneralAlerts } from '../../zod/generalAlert.schema';

const LABELS = {
  emptyHint: 'Set thresholds to receive budget exceedance alerts',
  removeThreshold: 'Remove threshold',
  deleteAriaLabel: 'delete threshold cell',
  addThreshold: 'Add Threshold',
};

export const ThresholdForm = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext<FormGeneralAlerts>();
  const thresholds = watch(FORM_ID.THRESHOLD);

  const handleAppendThreshold = () => {
    const defaultThreshold = null;
    setValue(FORM_ID.THRESHOLD, [...thresholds, defaultThreshold]);
  };

  const handleDeleteThreshold = (index: number) => () => {
    setValue(FORM_ID.THRESHOLD, thresholds.filter((_, position) => position !== index).map(Number));
    trigger();
  };

  const getError = (index: number) => errors[FORM_ID.THRESHOLD]?.[index]?.message;

  const handleChange =
    (onChange: (...event: unknown[]) => void) => (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value.replace(/\D/gu, '');

      const value = inputValue === '' ? null : +inputValue;

      onChange(value);
    };

  return (
    <VStack gap={4}>
      {isEmpty(thresholds) ? (
        <VStack
          alignItems="center"
          justifyContent="center"
          sx={{ py: 6, bgcolor: 'gray.disableLight' }}
        >
          <Typography color="text.secondary">{LABELS.emptyHint}</Typography>
        </VStack>
      ) : (
        thresholds.map((_, index) => {
          const errMsg = getError(index);

          return (
            <VStack key={index}>
              <HStack alignItems="center" gap={2}>
                <Controller
                  name={`${FORM_ID.THRESHOLD}.${index}`}
                  control={control}
                  render={({ field: { ref, value, onChange, ...others } }) => (
                    <InputBase
                      {...others}
                      value={value ?? ''}
                      inputProps={{
                        inputMode: 'numeric',
                      }}
                      inputRef={ref}
                      // 新增 threshold 時，自動 focus 新增的 field
                      autoFocus={index === thresholds.length - 1}
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      onChange={handleChange(onChange)}
                      error={!!errMsg}
                      sx={{ width: 80 }}
                    />
                  )}
                />
                <Tooltip title={LABELS.removeThreshold} placement="top">
                  <IconButton
                    size="small"
                    aria-label={LABELS.deleteAriaLabel}
                    onClick={handleDeleteThreshold(index)}
                  >
                    <Icon name="delete" />
                  </IconButton>
                </Tooltip>
              </HStack>
              {errMsg && <FormHelperText error>{errMsg}</FormHelperText>}
            </VStack>
          );
        })
      )}
      <Button
        variant="text"
        startIcon={<Icon name="add_circle" />}
        onClick={handleAppendThreshold}
        disabled={thresholds.length >= MAXIMUM_THRESHOLDS}
        sx={{ mr: 'auto' }}
      >
        <Typography variant="bodyBold">{LABELS.addThreshold}</Typography>
      </Button>
    </VStack>
  );
};
