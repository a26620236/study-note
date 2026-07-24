import type { ReactNode } from 'react';

import {
  TextField,
  Typography,
  useTheme,
  type SxProps,
  type TextFieldProps,
  type Theme,
} from '@mui/material';

import { InputLabel } from './InputLabel';

export type InputProps = TextFieldProps & {
  label?: ReactNode;
  required?: boolean;
  dataTestId?: string;
  tooltipText?: ReactNode;
};

export function Input({ dataTestId, label, required, tooltipText, sx, ...props }: InputProps) {
  const theme = useTheme();

  const textFieldStyle: SxProps<Theme> = {
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px',
      padding: '0px 8px',
      '&.Mui-disabled': {
        borderColor: 'gray.border',
        color: 'gray.disableDark',
        bgcolor: 'gray.disableLight',
        '& input::placeholder': {
          opacity: 0.6,
        },
      },
    },
    '& .MuiInputBase-input': {
      '&::placeholder': {
        color: theme.palette.text.hint,
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '21px',
      },
    },
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: '100%',
      left: 0,
      mt: 0.5,
      mx: 0,
    },
  };

  return (
    <TextField
      data-testid={dataTestId}
      label={
        label ? (
          <InputLabel
            label={<Typography variant="buttonBold1">{label}</Typography>}
            required={required}
            tooltipText={tooltipText}
          />
        ) : undefined
      }
      sx={{ ...textFieldStyle, ...sx }}
      {...props}
    />
  );
}
