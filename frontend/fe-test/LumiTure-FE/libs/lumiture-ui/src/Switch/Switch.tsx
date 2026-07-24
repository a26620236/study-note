import { forwardRef, type ReactNode } from 'react';

import {
  FormControlLabel,
  Switch as MuiSwitch,
  type SwitchProps as MuiSwitchProps,
} from '@mui/material';

export type SwitchProps = MuiSwitchProps & {
  label: ReactNode;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, ...restMuiSwitchProps },
  ref
) {
  return (
    <FormControlLabel
      control={<MuiSwitch ref={ref} {...restMuiSwitchProps} />}
      label={label}
      sx={{ m: 0, gap: 2.5 }}
    />
  );
});
