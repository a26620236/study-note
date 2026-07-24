import type { ButtonProps, ThemeOptions } from '@mui/material';

type CustomButtonProps = {
  isSelected?: boolean;
} & ButtonProps;

export const muiButton: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      variant: 'contained',
      color: 'primary',
      disableElevation: true,
    },
    styleOverrides: {
      root: (props) => {
        const { ownerState, theme } = props;
        const colorKey =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
          (ownerState.color as Exclude<CustomButtonProps['color'], 'inherit'>) || 'primary';

        const isOtherColor = ['error', 'warning', 'success'].includes(colorKey);

        const getButtonColor = (key: string) => {
          const colorPalette = theme.palette[colorKey];
          return key in theme.palette[colorKey]
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
              colorPalette[key as keyof typeof colorPalette]
            : colorPalette.main;
        };

        return {
          textTransform: 'capitalize',
          fontWeight: 700,
          borderRadius: 5,
          minWidth: 80,
          color: ownerState.isSelected
            ? `${getButtonColor('main')} !important`
            : getButtonColor('main'),
          borderColor: getButtonColor('main'),

          // variants
          '&.MuiButton-contained': {
            color: theme.palette.common.white,
            backgroundColor: getButtonColor('main'),
            '& svg': {
              color: theme.palette.common.white,
            },
            '&:hover': {
              color: theme.palette.common.white,
              backgroundColor: getButtonColor('light'),
              '& svg': {
                color: theme.palette.common.white,
              },
              [`&.MuiButton-containedSuccess, &.MuiButton-containedError`]: {
                backgroundColor: getButtonColor('hover'),
              },
            },
            '&.Mui-disabled': {
              backgroundColor: theme.palette.gray.disableDark,
              color: theme.palette.common.white,
              '& .MuiButton-startIcon, .MuiButton-endIcon': {
                '& svg': {
                  color: theme.palette.common.white,
                },
              },
            },

            '&:active': {
              backgroundColor: getButtonColor('dark'),
            },
          },
          '&.MuiButton-outlined': {
            backgroundColor: theme.palette.white.main,
            '&.Mui-focusVisible:not(&.MuiButton-dashed)': {
              borderColor: getButtonColor('main'),
              backgroundColor: getButtonColor('main'),
            },
          },
          '&.MuiButton-text': {
            padding: '0 !important',
            borderRadius: 'unset',
            minWidth: 'unset',
            '&.Mui-disabled': {
              backgroundColor: 'transparent',
            },
          },
          '&.MuiButton-dashed': {
            backgroundColor: theme.palette.white.main,
            border: '1px dashed',
          },
          '&.MuiButton-link': {
            fontWeight: 400,
            padding: '0',
            borderRadius: 'unset',
            minWidth: 'unset',
            textDecoration: 'underline',
            textUnderlinePosition: 'from-font',
          },
          '& svg': {
            color: ownerState.isSelected
              ? `${getButtonColor('main')} !important`
              : getButtonColor('main'),
          },
          // status
          '&:hover': {
            color: getButtonColor('hover'),
            /**
             * TODO: 需要修正定義的方式
             * 此判斷是因為只有primary跟secondary的backgroundColor是light10，其他都是bg
             * 對應palette.ts的colorKit
             */
            backgroundColor: `${getButtonColor(isOtherColor ? 'bg' : 'light10')} `,
            '& svg': { color: getButtonColor('hover') },
            [`&.MuiButton-text, &.MuiButton-link`]: {
              backgroundColor: 'unset',
            },
          },
          '&:active': {
            color: getButtonColor('dark'),
            backgroundColor: getButtonColor(isOtherColor ? 'light' : 'light20'),
            '& svg': { color: getButtonColor('dark') },
          },
          '&.Mui-disabled': {
            color: theme.palette.gray.disableDark,
            backgroundColor: 'white',
            '& .MuiButton-startIcon': {
              '& svg': {
                color: theme.palette.gray.disableDark,
              },
            },
          },
          // icon
          '& span.MuiButton-startIcon': { marginLeft: 0, marginRight: 4 },
          '& span.MuiButton-endIcon': { marginLeft: 4 },
          // size
          '&.MuiButton-sizeExSmall': {
            fontSize: 12,
            lineHeight: '12px',
            height: 26,
            padding: '0 12px',
            '& span.MuiButton-startIcon, & span.MuiButton-endIcon': {
              '& > *:nth-of-type(1)': {
                fontSize: 12,
              },
            },
          },
          '&.MuiButton-sizeSmall': {
            fontSize: 14,
            lineHeight: '14px',
            height: 30,
            padding: '0 12px',
            '& span.MuiButton-startIcon, & span.MuiButton-endIcon': {
              '& > *:nth-of-type(1)': {
                fontSize: 14,
              },
            },
          },
          '&.MuiButton-sizeMedium': {
            fontSize: 14,
            lineHeight: '14px',
            height: 36,
            padding: '0 16px',
            '& span.MuiButton-startIcon, & span.MuiButton-endIcon': {
              '& > *:nth-of-type(1)': {
                fontSize: 16,
              },
            },
          },
          '&.MuiButton-sizeLarge': {
            fontSize: 16,
            lineHeight: '16px',
            height: 44,
            padding: '0 16px',
            '& span.MuiButton-startIcon, & span.MuiButton-endIcon': {
              '& > *:nth-of-type(1)': {
                fontSize: 16,
              },
            },
          },
        };
      },
    },
  },
};
