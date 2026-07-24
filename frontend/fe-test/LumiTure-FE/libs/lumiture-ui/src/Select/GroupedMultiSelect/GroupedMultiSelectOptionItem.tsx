import { useCallback } from 'react';

import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { GroupOption } from './groupedMultiSelect.types';

export interface GroupedMultiSelectOptionItemProps {
  groupKey: string;
  option: GroupOption;
  isSelected: boolean;
  onToggleSelect: (groupKey: string, optionId: string) => void;
  style?: React.CSSProperties;
}

export function GroupedMultiSelectOptionItem({
  groupKey,
  option,
  isSelected,
  onToggleSelect,
}: GroupedMultiSelectOptionItemProps) {
  const handleClick = useCallback(() => {
    onToggleSelect(groupKey, option.id);
  }, [groupKey, option.id, onToggleSelect]);

  return (
    <Tooltip title={option.name} placement="left">
      <ListItem onClick={handleClick} sx={{ pl: '32px' }}>
        <Checkbox sx={{ pl: 0 }} checked={isSelected} />
        <Typography noWrap>{option.name}</Typography>
        {option.desc && (
          <Typography color="textHint" sx={{ ml: 1 }} noWrap>
            ({option.desc})
          </Typography>
        )}
      </ListItem>
    </Tooltip>
  );
}
