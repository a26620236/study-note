import { TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { AsteriskRed, HStack } from '@lumiture-ui';

import type { AzureBillingIntegrationForm } from '../../hooks/useAzureBillingIntegrationForm';

interface AzureAuthorizationInputProps {
  name: 'tenantId' | 'subscriptionId';
  label: string;
  placeholder: string;
}

export function AzureAuthorizationInput({
  name,
  label,
  placeholder,
}: AzureAuthorizationInputProps) {
  const { control } = useFormContext<AzureBillingIntegrationForm>();

  return (
    <HStack sx={{ alignItems: 'center', flexWrap: 'nowrap', gap: '20px' }}>
      <HStack sx={{ alignItems: 'center', gap: 1, flexShrink: 0, width: '120px' }}>
        <Typography variant="bodyBold">{label}</Typography>
        <AsteriskRed />
      </HStack>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            required
            fullWidth
            size="small"
            margin="none"
            id={field.name}
            value={field.value}
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            placeholder={placeholder}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        )}
      />
    </HStack>
  );
}
