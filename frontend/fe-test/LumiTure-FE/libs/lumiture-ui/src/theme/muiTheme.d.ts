import type { CSSProperties } from 'react';

import '@mui/material/styles';

import type { palette } from './palette';

declare module '@mui/material/styles' {
  interface TypeBackground {
    page: string;
  }

  interface TypeText {
    hint: string;
    link: string;
  }

  interface TypographyVariants {
    bodyMedium: CSSProperties;
    bodyBold: CSSProperties;
    subtitle: CSSProperties;
    caption: CSSProperties;
    captionMedium: CSSProperties;
    captionBold: CSSProperties;
    buttonRegular0: CSSProperties;
    buttonRegular1: CSSProperties;
    buttonRegular2: CSSProperties;
    buttonMedium0: CSSProperties;
    buttonMedium1: CSSProperties;
    buttonMedium2: CSSProperties;
    buttonBold0: CSSProperties;
    buttonBold1: CSSProperties;
    buttonBold2: CSSProperties;
    link: CSSProperties;
    linkBold: CSSProperties;
  }

  interface Palette {
    primary: (typeof palette)['primary'];
    secondary: (typeof palette)['secondary'];
    success: (typeof palette)['success'];
    error: (typeof palette)['error'];
    warning: (typeof palette)['warning'];
    gray: (typeof palette)['gray'];
    white: (typeof palette)['white'];
    black: (typeof palette)['black'];
    text: (typeof palette)['text'];
    colorKit: (typeof palette)['colorKit'];
  }

  interface PaletteOptions {
    primary?: (typeof palette)['primary'];
    secondary?: (typeof palette)['secondary'];
    success?: (typeof palette)['success'];
    error?: (typeof palette)['error'];
    warning?: (typeof palette)['warning'];
    gray?: (typeof palette)['gray'];
    white?: (typeof palette)['white'];
    black?: (typeof palette)['black'];
    text?: (typeof palette)['text'];
    colorKit?: (typeof palette)['colorKit'];
  }

  interface PaletteColor {
    light10: string;
    light20: string;
    light30: string;
    hover: string;
    bg: string;
  }

  interface SimplePaletteColorOptions {
    light10?: string;
    light20?: string;
    light30?: string;
    hover?: string;
    bg?: string;
  }

  interface ZIndex {
    datepicker: number;
    popper: number;
    dropdown: number;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
    borderless: true;
    link: true;
  }
  interface ButtonPropsSizeOverrides {
    'ex-small': true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsSizeOverrides {
    'ex-small': true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsSizeOverrides {
    'ex-small': true;
  }
  interface ChipPropsVariantOverrides {
    text: true;
    rounded: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bodyMedium: true;
    bodyBold: true;
    subtitle: true;
    caption: true;
    captionMedium: true;
    captionBold: true;
    buttonRegular0: true;
    buttonRegular1: true;
    buttonRegular2: true;
    buttonMedium0: true;
    buttonMedium1: true;
    buttonMedium2: true;
    buttonBold0: true;
    buttonBold1: true;
    buttonBold2: true;
    link: true;
    linkBold: true;
  }
}

declare module '@mui/material/InputLabel' {
  interface InputLabelPropsSizeOverrides {
    medium: true;
  }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsSizeOverrides {
    large: true;
  }
}
