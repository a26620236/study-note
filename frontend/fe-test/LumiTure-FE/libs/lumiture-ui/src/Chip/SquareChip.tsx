'use client';

import Chip, { type ChipProps } from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { Icon } from '../Icon';

const StyledChip = styled(Chip)<ChipProps>(({ icon, theme }) => ({
  /**
   * Moved from theme/components/index.ts to avoid affecting other components using Chip.
   * Not sure why previous developers put these styles in theme override instead of component level
   */
  borderRadius: 5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '300px',
  color: theme.palette.text.secondary,
  borderColor: theme.palette.gray.border,
  backgroundColor: theme.palette.white.main,
  '& .MuiChip-label': {
    fontWeight: 400,
    padding: theme.spacing(0, 2),
    paddingLeft: icon && theme.spacing(1.5),
  },
  '& .MuiChip-icon': {
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(-0.8),
    width: 16,
    height: 16,
  },
  '& .MuiChip-avatar': {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primary.light30,
    marginLeft: 3,
    width: '24px !important',
    height: '24px !important',
    fontSize: '14px !important',
    lineHeight: '22px !important',
    svg: {
      width: 16,
    },
  },

  // error
  // ...(ownerState.error && {
  //   borderColor: `${theme.palette.error.main} !important`,
  // }),

  // default disabled
  '&.Mui-disabled': {
    opacity: 1,
    borderColor: theme.palette.gray.disableDark,

    span: {
      opacity: 0.35,
    },

    '& .MuiChip-icon': {
      color: theme.palette.gray.disableDark,
    },
    '& .MuiChip-avatar': {
      opacity: 0.5,
    },
    '& .MuiChip-deleteIcon': {
      color: `${theme.palette.gray.borderLight} !important`,
    },
  },

  // (onClick) color default
  '&.MuiChip-clickable': {
    '&:hover': {
      borderColor: theme.palette.gray.borderLight,
      backgroundColor: theme.palette.gray.hover,
    },
    '&:active': {
      boxShadow: 'unset',
      borderColor: theme.palette.gray.borderDark,
    },
  },
  // (onDelete) color default
  '&.MuiChip-deletable': {
    '& .MuiChip-deleteIcon': {
      width: 16,
      height: 16,
      color: theme.palette.gray.border,
      '&:hover': {
        color: theme.palette.gray.borderLight,
      },
      '&:active': {
        color: theme.palette.gray.borderDark,
      },
    },
  },

  '&.MuiChip-colorPrimary': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '& .MuiChip-icon': {
      color: theme.palette.primary.main,
    },
    // (onClick) color primary
    '&.MuiChip-clickable': {
      '&:hover': {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.light,
        backgroundColor: theme.palette.primary.light10,
      },
      '&:active': {
        borderColor: theme.palette.primary.dark,
        '& .MuiChip-icon': {
          color: theme.palette.primary.dark,
        },
      },
    },
    // (onDelete) color primary
    '&.MuiChip-deletable': {
      '& .MuiChip-deleteIcon': {
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.light,
        },
        '&:active': {
          color: theme.palette.primary.dark,
        },
      },
    },
    // primary disabled
    '&.Mui-disabled': {
      opacity: 1,
      color: theme.palette.text.hint,
      borderColor: theme.palette.gray.disableDark,

      '& .MuiChip-icon': {
        color: theme.palette.gray.disableDark,
      },
      '& .MuiChip-avatar': {
        opacity: 0.5,
      },
      '& .MuiChip-deleteIcon': {
        color: `${theme.palette.gray.borderLight} !important`,
      },
    },
  },

  '&.MuiChip-colorError': {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '& .MuiChip-icon': {
      color: theme.palette.error.main,
    },
  },

  // isSelected
  '&.MuiChip-filledPrimary': {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primary.main,

    '& .MuiChip-icon': {
      color: `${theme.palette.white.main} !important`,
    },
    '&.Mui-disabled': {
      color: `${theme.palette.white.main} !important`,
      backgroundColor: theme.palette.gray.disableDark,
      opacity: 1,
    },
    '&.MuiChip-clickable:hover, &.MuiChip-deletable:hover': {
      color: `${theme.palette.white.main} !important`,
      backgroundColor: `${theme.palette.primary.light} !important`,
    },
    '&.MuiChip-clickable:active, &.MuiChip-deletable:active': {
      color: `${theme.palette.white.main} !important`,
      backgroundColor: `${theme.palette.primary.dark} !important`,
    },
  },
  // size
  '&.MuiChip-sizeEx-small': {
    height: 20,
    lineHeight: '20px',
    fontSize: 12,
  },
  '&.MuiChip-sizeSmall': {
    height: 24,
    fontSize: 14,
  },
  '&.MuiChip-sizeMedium': {
    height: 30,
    lineHeight: '30px',
    fontSize: 14,
  },
  '&.MuiChip-sizeLarge': {
    height: 36,
    lineHeight: '36px',
    fontSize: 14,
    borderRadius: 20,
  },
}));

const DeleteButton = (props: Partial<ChipProps>) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    sx={{
      width: 'unset !important',
      height: '100% !important',
      m: '0 !important',
      px: 1,
      '&.MuiChip-deleteIconColorDefault': {
        bgcolor: 'gray.border',
        '&:hover': { bgcolor: 'gray.hover' },
        '&:active': { bgcolor: 'gray.borderDark' },
      },
      '&.MuiChip-deleteIconColorPrimary': {
        bgcolor: 'primary.main',
        '&:hover': { bgcolor: 'primary.hover' },
        '&:active': { bgcolor: 'primary.dark' },
      },
      '&.MuiChip-deleteIconColorError': {
        bgcolor: 'error.main',
        '&:hover': { bgcolor: 'error.hover' },
        '&:active': { bgcolor: 'error.dark' },
      },
      bgcolor: 'primary.main',
      cursor: 'pointer',
    }}
    {...props}
  >
    <Icon name="close" sx={{ fontSize: 16, color: 'common.white' }} />
  </Stack>
);

export function SquareChip(props: ChipProps) {
  return <StyledChip variant="outlined" size="medium" {...props} deleteIcon={<DeleteButton />} />;
}
