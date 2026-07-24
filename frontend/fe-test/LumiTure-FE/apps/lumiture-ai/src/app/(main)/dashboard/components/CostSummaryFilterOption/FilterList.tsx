import type { PropsWithChildren } from 'react';

import { Box, Typography } from '@mui/material';

export function FilterList({ children }: PropsWithChildren) {
  return (
    <Box component="ul" sx={{ margin: 0, paddingLeft: 6 }}>
      {children}
    </Box>
  );
}

function FilterListItem({ children }: PropsWithChildren) {
  return (
    <Box component="li" sx={{ fontSize: 10 }}>
      {children}
    </Box>
  );
}

interface FilterLabelValueProps {
  label: string;
  value: string;
}

export function FilterLabelValue({ label, value }: FilterLabelValueProps) {
  return (
    <FilterListItem>
      <Typography variant="body1">
        {label}: {value}
      </Typography>
    </FilterListItem>
  );
}
