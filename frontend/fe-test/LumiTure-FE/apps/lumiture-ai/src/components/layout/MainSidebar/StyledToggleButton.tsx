'use client';

import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

export const StyledToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isShow',
})<IconButtonProps & { isShow: boolean }>(({ theme, isShow }) => ({
  position: 'absolute',
  bottom: '24px',
  right: 0,
  transform: 'translateX(50%)',
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  opacity: isShow ? 1 : 0,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.sharp,
    duration: isShow
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  }),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
