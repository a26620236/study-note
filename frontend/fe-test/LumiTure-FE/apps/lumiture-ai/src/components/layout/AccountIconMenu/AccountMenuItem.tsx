import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import { alpha, type SxProps } from '@mui/material/styles';

interface AccountMenuItemProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  sx?: SxProps;
}

export const AccountMenuItem = ({ onClick, icon, label, sx }: AccountMenuItemProps) => (
  <MenuItem sx={{ p: 0, '&:hover': { backgroundColor: 'primary.main' }, ...sx }} onClick={onClick}>
    <ListItemIcon sx={{ '& .MuiIcon-root': { fontSize: 24, color: 'common.white' } }}>
      {icon}
    </ListItemIcon>
    {label}
  </MenuItem>
);

interface AccountMenuItemWrapProps {
  children: ReactNode;
  sx?: SxProps;
}

export const AccountMenuItemWrap = ({ children, sx }: AccountMenuItemWrapProps) => (
  <Box
    sx={{
      px: 4,
      py: 2,
      borderTop: '1px solid',
      borderColor: (theme) => alpha(theme.palette.common.white, 0.2),
      ...sx,
    }}
  >
    {children}
  </Box>
);
