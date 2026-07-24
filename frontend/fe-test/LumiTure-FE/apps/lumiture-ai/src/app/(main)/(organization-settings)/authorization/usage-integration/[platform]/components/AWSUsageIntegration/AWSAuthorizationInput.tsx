import { TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { AsteriskRed, HStack } from '@lumiture-ui';

import type { AWSUsageIntegrationForm } from '../../hooks/useAWSUsageIntegrationForm';

interface AWSAuthorizationInputProps {
  name: 'stacksetName' | 'roleName' | 'accountId' | 'externalId';
  label: string;
  placeholder: string;
}

export function AWSAuthorizationInput({ name, label, placeholder }: AWSAuthorizationInputProps) {
  const { control } = useFormContext<AWSUsageIntegrationForm>();

  return (
    <HStack sx={{ alignItems: 'center', flexWrap: 'nowrap', gap: '20px' }}>
      <HStack sx={{ alignItems: 'center', gap: 1, flexShrink: 0, width: '246px' }}>
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
