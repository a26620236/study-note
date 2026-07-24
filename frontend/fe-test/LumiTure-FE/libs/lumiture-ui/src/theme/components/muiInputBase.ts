import type { ThemeOptions } from '@mui/material';

export const muiInputBase: ThemeOptions['components'] = {
  MuiInputBase: {
    defaultProps: {
      size: 'medium',
    },
    styleOverrides: {
      root: ({ ownerState, theme }) => {
        if (ownerState.readOnly) {
          return {
            color: '#000910',
            padding: theme.spacing(2, 0),
            border: 'unset',
            backgroundColor: 'transparent',
            '& input:-webkit-autofill': {
              WebkitBoxShadow: ' 0 0 0 30px white inset !important',
            },
          };
        }
        return {
          position: 'relative',
          width: '100%',
          padding: theme.spacing(2),
          border: `1px solid ${theme.palette.gray.border}`,
          borderRadius: '5px',
          backgroundColor: '#FFFFFF',
          color: '#000910',

          // medium size style
          height: 36,
          '& .MuiSvgIcon-root': {
            width: 20,
            height: 20,
          },

          '& input:-webkit-autofill': {
            WebkitBoxShadow: ' 0 0 0 30px white inset !important',
          },
          '&:hover': {
            borderColor: 'transparent',
            outline: `2px solid ${theme.palette.gray.border}`,
            outlineOffset: -2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent !important',
          },
          '&.Mui-focused': {
            borderColor: 'transparent',
            outline: `2px solid ${theme.palette.gray.border}`,
            outlineOffset: -2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
          },
          '&.Mui-error': {
            border: `1px solid ${theme.palette.error.main}`,
            '&:hover': {
              borderColor: 'transparent',
              outline: `2px solid  ${theme.palette.error.main}`,
              outlineOffset: -2,
            },
          },
          '&.Mui-error.Mui-focused': {
            borderColor: 'transparent',
            outline: `2px solid  ${theme.palette.error.main}`,
            outlineOffset: -2,
          },
          '&.Mui-disabled': {
            borderColor: '#e9e9e9',
            cursor: 'not-allowed',
            color: '#D8D8D8',
            backgroundColor: '#F2F2F2',
            '&.MuiInputBase-adornedEnd,.MuiInputBase-adornedStart': {
              color: '#E6E6E6',
            },
            '&:hover': { outline: 'none' },
          },

          // size
          '&.MuiInputBase-sizeSmall': {
            height: 30,
            '& .MuiSvgIcon-root': {
              width: 20,
              height: 20,
            },
          },
          '&.MuiInputBase-sizeLarge': {
            height: 44,
            '& .MuiSvgIcon-root': {
              width: 24,
              height: 24,
            },
          },
          // adornment
          '&.MuiInputBase-adornedStart': {
            input: { paddingLeft: 4 },
            '& .MuiSvgIcon-root': {
              color: '#676767',
            },
          },
          '&.MuiInputBase-adornedEnd': {
            color: '#000910',
            '& .MuiSvgIcon-root': {
              color: '#676767',
            },
          },
          // multiline
          '&.MuiInputBase-multiline': {
            height: 130,
            overflow: 'auto',
            '& textarea': {
              alignSelf: 'flex-start',
            },
          },
        };
      },
      input: ({ theme }) => ({
        padding: '0 !important',
        fontSize: 14,
        '&::placeholder': {
          color: theme.palette.text.hint,
          opacity: 1 /* Firefox */,
        },
      }),
    },
  },
};
