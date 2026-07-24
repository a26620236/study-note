'use client';

import { createTheme } from '@mui/material/styles';

import { components } from './components';
import { palette } from './palette';
import { typography } from './typography';

const TOOLBAR_MIN_HEIGHT_DESKTOP = 64;

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1280,
      lg: 1440,
      xl: 1920,
    },
  },
  mixins: {
    toolbar: {
      '@media (min-width: 600px)': {
        minHeight: TOOLBAR_MIN_HEIGHT_DESKTOP,
      },
    },
  },
  spacing: 4,
  zIndex: {
    datepicker: 1450, // Between snackbar (1400) and tooltip (1500)
    popper: 1600, // more than tooltip (1500)
    dropdown: 1700,
  },
  palette,
  components,
  typography,
});
