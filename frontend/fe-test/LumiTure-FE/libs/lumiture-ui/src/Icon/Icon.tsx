import { forwardRef } from 'react';

import MuiIcon, { type IconProps as MuiIconProps } from '@mui/material/Icon';
import type { MaterialSymbol } from 'material-symbols';

interface IconProps extends MuiIconProps {
  name: MaterialSymbol;
  className?: string;
  fill?: boolean;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { name, className, fill = true, ...others },
  ref
) {
  const classes = [fill ? 'fill' : '', className].filter(
    (clsName) => typeof clsName === 'string' && !!clsName.length
  );
  return (
    <MuiIcon ref={ref} className={`material-symbols-rounded ${classes.join(' ')}`} {...others}>
      {name}
    </MuiIcon>
  );
});
