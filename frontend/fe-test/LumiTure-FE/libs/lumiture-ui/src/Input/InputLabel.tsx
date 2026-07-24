import type { ReactNode } from 'react';

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Tooltip, type SxProps } from '@mui/material';

import { AsteriskRed } from '../AsteriskRed';
import { HStack } from '../Stack';

interface InputLabelProps {
  label: ReactNode;
  required?: boolean;
  tooltipText?: ReactNode;
  rootSx?: SxProps;
}

export function InputLabel({ label, required = false, tooltipText, rootSx }: InputLabelProps) {
  return (
    <HStack
      sx={{ gap: 1, flexWrap: 'nowrap', whiteSpace: 'nowrap', alignItems: 'center', ...rootSx }}
    >
      {label}
      {required && <AsteriskRed />}
      {tooltipText && (
        <Tooltip title={tooltipText} placement="top">
          <InfoRoundedIcon name="info" sx={{ fontSize: 16, color: 'text.hint' }} />
        </Tooltip>
      )}
    </HStack>
  );
}
