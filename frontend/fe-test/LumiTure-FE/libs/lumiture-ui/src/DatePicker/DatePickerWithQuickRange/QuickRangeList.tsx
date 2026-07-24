import List from '@mui/material/List';
import Stack from '@mui/material/Stack';

import { QuickRangeItem } from './QuickRangeItem';
import type { QuickRangeListProps } from './types';

export const QuickRangeList = ({
  list,
  selectedQuickRange,
  onQuickRangeSelect,
  children,
}: QuickRangeListProps) => (
  <Stack
    direction="row"
    sx={{
      height: 364,
      borderRadius: '6px',
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
      bgcolor: 'common.white',
    }}
  >
    <Stack sx={{ p: 5 }}>{children}</Stack>
    <List
      sx={{
        minWidth: 130,
        px: 2,
        py: 4,
        '& .MuiTypography-root': { fontWeight: 700, color: 'primary.main' },
      }}
    >
      {list.map((item) => (
        <QuickRangeItem
          key={item.label}
          selectedQuickRange={selectedQuickRange}
          onQuickRangeSelect={onQuickRangeSelect}
          {...item}
        />
      ))}
    </List>
  </Stack>
);
