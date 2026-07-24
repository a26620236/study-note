'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

import { Box, ClickAwayListener, List, Popper, styled, useTheme } from '@mui/material';

import { DropdownMenuItems } from './DropdownMenuItems';
import type { DropdownButtonProps } from './dropdownButton.types';

const MENU_BORDER_RADIUS = 6;

const SDropdownButtonContainer = styled(Box)(({ theme }) => ({
  boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.2)',
  '& .MuiList-padding': { padding: 0 },
  backgroundColor: theme.palette.white.main,
  borderRadius: MENU_BORDER_RADIUS,
  margin: theme.spacing(1.5, 0),
  overflow: 'hidden',
}));

export function DropdownButton<T = unknown>({
  anchorEl: _anchorEl,
  button,
  list,
  children,
  placement,
  onClose,
  isOpen,
  handleClose,
  handleOpen,
  popperProps,
  disabled,
  sx,
}: DropdownButtonProps<T>) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(_anchorEl);
  useEffect(() => {
    setAnchorEl(_anchorEl);
  }, [_anchorEl]);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (handleOpen) handleOpen(event);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    if (handleClose) handleClose();
    setAnchorEl(null);
    onClose?.();
  };

  const renderChildren = (): ReactNode => {
    if (typeof children === 'function') return children(handleMenuClose);
    if (children) return children;
    if (list) {
      return (
        <Box p={2.5}>
          <List>
            {list.length > 0 && <DropdownMenuItems list={list} handleMenuClose={handleMenuClose} />}
          </List>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ ...sx }}>
      <Box onClick={handleMenuOpen} sx={{ cursor: 'pointer' }}>
        {button}
      </Box>
      {(isOpen ?? Boolean(anchorEl)) && (
        <ClickAwayListener onClickAway={handleMenuClose}>
          <Popper
            open={isOpen ?? Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement={placement}
            sx={{ zIndex: theme.zIndex.dropdown }}
            {...popperProps}
          >
            <SDropdownButtonContainer sx={{ width: '100%' }}>
              {renderChildren()}
            </SDropdownButtonContainer>
          </Popper>
        </ClickAwayListener>
      )}
    </Box>
  );
}
