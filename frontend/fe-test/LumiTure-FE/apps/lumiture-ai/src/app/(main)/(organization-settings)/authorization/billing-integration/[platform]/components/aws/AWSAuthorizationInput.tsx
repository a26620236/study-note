import { TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { AsteriskRed, HStack } from '@lumiture-ui';

import type { AWSBillingIntegrationForm } from '../../hooks/useAWSBillingIntegrationForm';

interface AWSAuthorizationInputProps {
  name: keyof AWSBillingIntegrationForm;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
}

export function AWSAuthorizationInput({
  name,
  label,
  placeholder,
  autoFocus = false,
}: AWSAuthorizationInputProps) {
  const { control } = useFormContext<AWSBillingIntegrationForm>();

  return (
    <HStack flexWrap="nowrap" gap={2}>
      <HStack sx={{ alignItems: 'center', gap: 1, flexShrink: 0, width: '255px', height: '36px' }}>
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
            autoFocus={autoFocus}
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
