import { memo, useCallback } from 'react';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { UNGROUPED_KEY } from './constants';
import type { GroupSelectStatus } from './groupedMultiSelect.types';
import { theme } from '../../theme/theme';
export interface GroupHeaderProps {
  displayKey?: string;
  count?: number;
  groupKey: string;
  groupSelectStatus: GroupSelectStatus;
  onToggleGroupSelect: (groupKey: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (groupKey: string) => void;
}

const LABELS = {
  expand: 'Expand group',
  collapse: 'Collapse group',
};

export const GroupHeader = memo(function GroupHeader({
  displayKey,
  count,
  groupKey,
  groupSelectStatus,
  onToggleGroupSelect,
  isCollapsed,
  onToggleCollapse,
}: GroupHeaderProps) {
  const handleClick = useCallback(() => {
    onToggleGroupSelect(groupKey);
  }, [groupKey, onToggleGroupSelect]);

  const handleCollapseClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onToggleCollapse?.(groupKey);
    },
    [groupKey, onToggleCollapse]
  );

  // 未分組選項不顯示群組標題
  if (groupKey === UNGROUPED_KEY) return null;

  return (
    <ListItem
      onClick={handleClick}
      sx={{
        backgroundColor: theme.palette.primary.light10,
        color: theme.palette.text.primary,
        boxShadow: `inset 0 -1px 0 0 ${theme.palette.primary.light20}`,
        '&:hover': {
          backgroundColor: theme.palette.primary.light10,
          borderRadius: 0,
        },
      }}
    >
      <Checkbox
        sx={{
          pl: 0,
        }}
        checked={groupSelectStatus.isChecked}
        indeterminate={groupSelectStatus.isIndeterminate}
      />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={displayKey ?? groupKey}>
          <Typography noWrap variant="buttonRegular2" sx={{ minWidth: 0, fontWeight: 700 }}>
            {displayKey ?? groupKey}
          </Typography>
        </Tooltip>
        {count !== undefined && (
          <Typography variant="buttonRegular2" color="text.secondary" sx={{ flexShrink: 0 }}>
            ({count})
          </Typography>
        )}
      </Box>

      {onToggleCollapse && (
        <IconButton
          size="small"
          onClick={handleCollapseClick}
          aria-label={isCollapsed ? LABELS.expand : LABELS.collapse}
          sx={{ color: theme.palette.primary.main, ml: 1, p: 0.5 }}
        >
          {isCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      )}
    </ListItem>
  );
});
