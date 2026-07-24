import ListItem from '@mui/material/ListItem';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { UNGROUPED_KEY } from './constants';

export interface GroupedSingleSelectGroupHeaderProps {
  groupKey: string;
  displayKey?: string;
  isFirstHeader?: boolean;
  sx?: SxProps<Theme>;
}

export function GroupedSingleSelectGroupHeader({
  groupKey,
  displayKey,
  isFirstHeader = false,
  sx,
}: GroupedSingleSelectGroupHeaderProps) {
  if (groupKey === UNGROUPED_KEY) return null;

  return (
    <ListItem
      sx={[
        {
          bgcolor: 'transparent',
          cursor: 'default',
          py: 1,
          // group header 為純標籤、不可點，覆蓋全域 MuiListItem 的 hover 灰底 + pointer
          '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'default',
          },
          ...(isFirstHeader
            ? {}
            : {
                borderTop: '1px solid',
                borderColor: 'divider',
              }),
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- mui sx merge
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
        {displayKey ?? groupKey}
      </Typography>
    </ListItem>
  );
}
