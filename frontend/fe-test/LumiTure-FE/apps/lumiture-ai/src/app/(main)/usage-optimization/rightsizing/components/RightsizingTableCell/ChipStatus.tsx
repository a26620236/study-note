import { Box, Typography } from '@mui/material';

import { theme } from '@lumiture-ui/theme';

import type { RecommendationItem } from '@hooks-api';

const STYLE = {
  0: {
    // todo
    borderColor: theme.palette.colorKit.main[11],
    background: theme.palette.colorKit.light[11],
    color: theme.palette.colorKit.dark[11],
  },
  1: {
    // changed
    borderColor: theme.palette.colorKit.main[4],
    background: theme.palette.colorKit.light[4],
    color: theme.palette.colorKit.dark[4],
  },
  2: {
    // error
    borderColor: theme.palette.colorKit.main[8],
    background: theme.palette.colorKit.light[8],
    color: theme.palette.colorKit.dark[8],
  },
};

const STATUS_TEXT = {
  0: 'To-Do',
  1: 'Changed',
  2: 'Error',
};

interface StatusProps {
  status: RecommendationItem['status'];
}

export function ChipStatus({ status }: StatusProps) {
  const style = STYLE[status];
  const statusText = STATUS_TEXT[status];
  return (
    <Box
      p="0px 4px"
      borderRadius={1}
      border={1}
      borderColor={style.borderColor}
      bgcolor={style.background}
      color={style.color}
    >
      <Typography variant="buttonRegular0">{statusText}</Typography>
    </Box>
  );
}
