import type { CSSProperties } from 'react';

import type { ThemeOptions } from '@mui/material';

export const muiAvatar: ThemeOptions['components'] = {
  MuiAvatar: {
    defaultProps: {
      sizes: 'large',
      sx: { bgcolor: 'primary.light30' },
    },
    styleOverrides: {
      root: ({ ownerState, theme }) => {
        const getAvatarSizeStyles = (key = 'large'): CSSProperties => {
          const styles = {
            small: {
              width: '24px',
              height: '24px',
              ...theme.typography.bodyBold,
              lineHeight: '22px',
              svg: { width: 16 },
            },
            medium: {
              width: '32px',
              height: '32px',
              ...theme.typography.h5,
              lineHeight: '30px',
              svg: { width: 20 },
            },
            large: {
              width: '40px',
              height: '40px',
              ...theme.typography.h3,
              lineHeight: '38px',
              svg: { width: 26 },
            },
            'ex-large': {
              width: '64px',
              height: '64px',
              ...theme.typography.h2,
              lineHeight: '58px',
              svg: { width: 40, height: 40 },
            },
            'xx-large': {
              width: '100px',
              height: '100px',
              padding: 0,
              ...theme.typography.h5,
              fontSize: 60,
              lineHeight: '92px',
              svg: { width: 75, height: 75 },
            },
          };
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
          return key in styles ? styles[key as keyof typeof styles] : styles.large;
        };

        return {
          // default(text)
          '&.MuiAvatar-colorDefault, &.MuiChip-avatarColorPrimary': {
            color: theme.palette.white.main,
          },
          // size
          '&.MuiAvatar-root': {
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            ...getAvatarSizeStyles(ownerState.sizes),
          },
          // icon
          ...(ownerState.children &&
            typeof ownerState.children === 'object' && {
              backgroundColor: `${theme.palette.gray.borderLight} !important`,
              svg: {
                padding: 2,
                color: theme.palette.text.hint,
              },
            }),
          // image
          ...(ownerState.src && {
            backgroundColor: `${theme.palette.white.main} !important`,
          }),
        };
      },
    },
  },
};
