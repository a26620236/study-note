import type { CSSProperties } from 'react';

import { theme } from '../theme';

export interface SvgLinearGradientProps {
  id?: string;
  gradient?: {
    startColor: CSSProperties['color'];
    endColor: CSSProperties['color'];
  };
  coordinates?: {
    x1: CSSProperties['width'];
    y1: CSSProperties['height'];
    x2: CSSProperties['width'];
    y2: CSSProperties['height'];
  };
}

export const SvgLinearGradient = ({
  id = 'linear-gradient',
  gradient = {
    startColor: theme.palette.primary.main,
    endColor: theme.palette.secondary.main,
  },
  coordinates = {
    x1: '90%',
    y1: '90%',
    x2: '10%',
    y2: '85%',
  },
}: SvgLinearGradientProps) => {
  const { x1, y1, x2, y2 } = coordinates;
  return (
    <defs>
      <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
        <stop offset="0%" stopColor={gradient.startColor} />
        <stop offset="100%" stopColor={gradient.endColor} />
      </linearGradient>
    </defs>
  );
};
