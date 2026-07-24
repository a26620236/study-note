import { memo } from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import type { QuickRangeItemProps } from './types';

const QuickRangeItemComponent = ({
  label,
  value,
  selectedQuickRange,
  onQuickRangeSelect,
}: QuickRangeItemProps) => (
  <ListItemButton
    selected={label === selectedQuickRange}
    onClick={() => onQuickRangeSelect?.(label)}
    sx={{
      mb: 1,
      px: 3,
      py: 0,
      borderRadius: '5px',
      '&:hover': {
        bgcolor: 'primary.light10',
        '& .MuiTypography-root': { color: 'primary.light' },
      },
      '&.Mui-selected': {
        bgcolor: 'primary.light20',
        '& .MuiTypography-root': { color: 'primary.dark' },
      },
    }}
  >
    <ListItemText primary={value} />
  </ListItemButton>
);

QuickRangeItemComponent.displayName = 'QuickRangeItem';
export const QuickRangeItem = memo(QuickRangeItemComponent);
