import React from 'react';

import { Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { intersectionBy } from 'lodash-es';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { THRESHOLD_RANGE } from '@app/(main)/budget/constants/threshold';
import {
  LoadingField,
  LoadingThresholds,
} from '@app/(main)/budget/customized/components/BudgetAlertSettings/Loading';
import {
  FORM_ID,
  MAXIMUM_THRESHOLDS,
  STATUS_OPTIONS,
} from '@app/(main)/budget/customized/components/constants';
import ThresholdsForm from '@app/(main)/budget/customized/components/ThresholdsForm';
import type { CustomBudgetForm } from '@app/(main)/budget/customized/components/types';
import RecipientAutocomplete, {
  type Recipient,
} from '@components/Autocomplete/RecipientAutocomplete';
import { useGetCustomBudgetAlertOrgUsers } from '@hooks-api';

interface AlertSettingsFormProps {
  isLoading?: boolean;
}

const AlertSettingsForm = ({ isLoading }: AlertSettingsFormProps) => {
  const {
    control,
    formState: { isSubmitted },
    setValue,
  } = useFormContext<CustomBudgetForm>();
  const recipientIds = useWatch({
    control,
    name: FORM_ID.RECIPIENTS,
    defaultValue: [],
  });
  const getCustomBudgetAlertOrgUsersQuery = useGetCustomBudgetAlertOrgUsers();

  const recipients = getCustomBudgetAlertOrgUsersQuery.isSuccess
    ? intersectionBy(
        getCustomBudgetAlertOrgUsersQuery.data,
        recipientIds.map((id: string) => ({ id })),
        'id'
      )
    : [];

  const handleSetRecipients = (selectedRecipients: Recipient[]) => {
    const ids = selectedRecipients.map((recipient) => recipient.id);

    setValue(FORM_ID.RECIPIENTS, ids);
  };

  const handleRecipientAutocompleteBlur = (inputValue: string) => {
    setValue(FORM_ID.RECIPIENTS_INPUT, inputValue, {
      shouldValidate: isSubmitted,
    });
  };

  return (
    <>
      {isLoading || getCustomBudgetAlertOrgUsersQuery.isLoading ? (
        <LoadingField />
      ) : (
        <FormControl>
          <Controller
            name={FORM_ID.RECIPIENTS_INPUT}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <RecipientAutocomplete
                  options={getCustomBudgetAlertOrgUsersQuery.data ?? []}
                  label="Alert Recipients"
                  placeholder={
                    recipients.length === 0
                      ? "Please enter the recipients' name or email addresses."
                      : ''
                  }
                  value={recipients}
                  onChange={handleSetRecipients}
                  onBlurCallback={handleRecipientAutocompleteBlur}
                  loading={getCustomBudgetAlertOrgUsersQuery.isLoading}
                  error={fieldState.invalid}
                />
                <input {...field} hidden />
                <FormHelperText error>{fieldState.error?.message}</FormHelperText>
              </>
            )}
          />
        </FormControl>
      )}
      {isLoading ? (
        <LoadingField />
      ) : (
        <FormControl>
          <InputLabel size="small">Alert Status</InputLabel>
          <Controller
            name={FORM_ID.STATUS}
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
                {STATUS_OPTIONS.map((_option) => (
                  <MenuItem key={_option.label} value={String(_option.value)}>
                    {_option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      )}

      {isLoading ? (
        <LoadingThresholds />
      ) : (
        <Stack sx={{ gap: 2 }}>
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h6">Thresholds</Typography>
            <Typography variant="caption" color="text.secondary">
              {`You can set up to ${MAXIMUM_THRESHOLDS} thresholds. Allowed values: ${THRESHOLD_RANGE.MIN}~${THRESHOLD_RANGE.MAX}`}
            </Typography>
          </Stack>
          <ThresholdsForm />
        </Stack>
      )}
    </>
  );
};

export default AlertSettingsForm;
