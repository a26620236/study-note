import { TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { AsteriskRed, HStack } from '@lumiture-ui';

import type { GCPBillingIntegrationForm } from '../../hooks/useGCPBillingIntegrationForm';

interface GCPAuthorizationInputProps {
  name:
    | 'billingAccountId'
    | 'detailedUsageCost.projectId'
    | 'detailedUsageCost.datasetId'
    | 'pricing.projectId'
    | 'pricing.datasetId';
  label: string;
  placeholder: string;
}

export function GCPAuthorizationInput({ name, label, placeholder }: GCPAuthorizationInputProps) {
  const { control } = useFormContext<GCPBillingIntegrationForm>();

  return (
    <HStack sx={{ flexWrap: 'nowrap', gap: '20px' }}>
      <HStack sx={{ alignItems: 'center', gap: 1, flexShrink: 0, width: '136px', height: '36px' }}>
        <Typography variant="buttonBold1">{label}</Typography>
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
