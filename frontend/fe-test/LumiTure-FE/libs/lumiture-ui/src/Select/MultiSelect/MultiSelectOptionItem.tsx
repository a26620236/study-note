import type { CSSProperties } from 'react';

import { Checkbox, ListItem, Tooltip, Typography } from '@mui/material';

import type { Option } from './multiSelect.types';

interface OptionListItemProps<T = string> {
  id: T;
  name: string;
  desc?: string;
  isSelected: boolean;
  onClick: (item: Option<T>) => void;
  style?: CSSProperties;
}

export function MultiSelectOptionItem<T = string>({
  id,
  name,
  desc = '',
  isSelected,
  onClick,
  style = {},
}: OptionListItemProps<T>) {
  return (
    <Tooltip title={name} placement="left">
      <ListItem key={String(id)} onClick={() => onClick({ id, name })} sx={style}>
        <Checkbox sx={{ pl: 0 }} checked={isSelected} />
        <Typography
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {name}
        </Typography>
        {desc && (
          <Typography
            color="textHint"
            sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            ({desc})
          </Typography>
        )}
      </ListItem>
    </Tooltip>
  );
}
