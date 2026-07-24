import type { CSSProperties, ReactNode } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export interface Option<T = string | number> {
  id: T;
  name: string;
  desc?: string;
  tags?: ReactNode[];
  tooltipText?: ReactNode;
}

const StyledOptionItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.action.selected : theme.palette.action.hover,
  },
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

type SelectOptionItemProps<T = string | number> = Option<T> & {
  isSelected: boolean;
  onClick: (item: Option<T>) => void;
  style?: CSSProperties;
};

export function SelectOptionItem<T = string | number>({
  id,
  name,
  tooltipText,
  desc = '',
  tags = [],
  isSelected,
  onClick,
  style = {},
}: SelectOptionItemProps<T>) {
  const optionStyle: CSSProperties =
    style.position === 'absolute' ? { ...style, width: 'auto', right: 0 } : style;

  return (
    <Tooltip title={tooltipText ?? name} placement="left">
      <StyledOptionItem
        onClick={() => onClick({ id, name })}
        isSelected={isSelected}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...optionStyle,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography noWrap>{name}</Typography>
          {desc && (
            <Typography color="textHint" sx={{ ml: 1 }}>
              ({desc})
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0,
            ml: 1,
          }}
        >
          {tags.map((tag, order) => (
            <Box component="span" key={order} sx={{ display: 'contents' }}>
              {tag}
            </Box>
          ))}
        </Box>
      </StyledOptionItem>
    </Tooltip>
  );
}
