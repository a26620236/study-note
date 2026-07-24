'use client';

import { Chip, styled, type ChipProps, type Theme } from '@mui/material';

const STATUS = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  new: 'new',
  pleaseConfirm: 'pleaseConfirm',
  closed: 'closed',
  waiting: 'waiting',
} as const;

type StatusChipProps = ChipProps & {
  status: (typeof STATUS)[keyof typeof STATUS];
};

const getBackground = (theme: Theme) => ({
  [STATUS.success]: theme.palette.success.bg,
  [STATUS.error]: theme.palette.error.bg,
  [STATUS.warning]: theme.palette.warning.bg,
  [STATUS.new]: theme.palette.colorKit.light[2],
  [STATUS.pleaseConfirm]: theme.palette.colorKit.light[9],
  [STATUS.closed]: theme.palette.colorKit.light[11],
  [STATUS.waiting]: theme.palette.colorKit.light[1],
});

const getIconBackground = (theme: Theme) => ({
  [STATUS.success]: theme.palette.colorKit.main[4],
  [STATUS.error]: theme.palette.error.main,
  [STATUS.warning]: theme.palette.warning.dark,
  [STATUS.new]: theme.palette.primary.main,
  [STATUS.pleaseConfirm]: theme.palette.colorKit.main[9],
  [STATUS.closed]: theme.palette.colorKit.main[11],
  [STATUS.waiting]: theme.palette.colorKit.dark[1],
});

const StyledChip = styled(Chip)<StatusChipProps>(({ theme, status, variant }) => ({
  height: '24px',
  color: theme.palette.text.primary,
  backgroundColor: variant === 'text' ? 'none' : getBackground(theme)[status],
  borderRadius: variant === 'rounded' ? '30px' : '4px',
  padding: '3px 8px',
  '& .MuiChip-label': {
    padding: 0,
    marginLeft: 4,
    fontSize: '12px',
    lineHeight: '18px',
  },
  '& .MuiChip-icon': {
    margin: 0,
    backgroundColor: getIconBackground(theme)[status],
  },
}));

const StatusIcon = styled('div')({
  width: 8,
  height: 8,
  borderRadius: '50%',
});

export function StatusChip({ status, ...MuiChipProps }: StatusChipProps) {
  return <StyledChip icon={<StatusIcon />} status={status} {...MuiChipProps} />;
}
