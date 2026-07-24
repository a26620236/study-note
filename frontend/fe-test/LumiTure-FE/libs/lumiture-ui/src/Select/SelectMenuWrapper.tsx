import { alpha, Box, styled } from '@mui/material';

export const SelectMenuWrapper = styled(Box)(({ theme }) => ({
  boxShadow: `0px 0px 6px 0px ${alpha(theme.palette.black.main, 0.2)}`,
  '& .MuiList-padding': { padding: 0 },
  backgroundColor: theme.palette.white.main,
  borderRadius: 6,
  margin: theme.spacing(1.5, 0),
  overflow: 'hidden',
}));
