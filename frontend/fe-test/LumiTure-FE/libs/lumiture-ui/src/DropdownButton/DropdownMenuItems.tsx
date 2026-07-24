'use client';

import type { MouseEvent } from 'react';

import { Box, ListItemButton, ListItemIcon, Tooltip } from '@mui/material';

import { HStack } from '../Stack';

import type { DropdownButtonItem } from './dropdownButton.types';

const MENU_ITEM_BORDER_RADIUS = '5px';

interface DropdownMenuItemsProps<T> {
  list: DropdownButtonItem<T>[];
  handleMenuClose: () => void;
}

export const DropdownMenuItems = <T,>({ list, handleMenuClose }: DropdownMenuItemsProps<T>) => (
  <Box>
    {list.map((item, index) => {
      const {
        label,
        value,
        icon,
        onClick,
        disabled,
        selected,
        tooltipText,
        dataTestId,
        tags = [],
      } = item;

      const itemKey = typeof label === 'string' ? label : index;

      const handleItemClick = (event: MouseEvent<HTMLElement>) => {
        if (disabled) return;
        event.stopPropagation();
        if (onClick) onClick(value);
        handleMenuClose();
      };
      return (
        <Tooltip key={itemKey} title={tooltipText} placement="left">
          <Box>
            <ListItemButton
              key={itemKey}
              onClick={handleItemClick}
              disabled={disabled}
              selected={selected}
              data-testid={dataTestId}
              sx={{
                borderRadius: MENU_ITEM_BORDER_RADIUS,
                '&.Mui-selected': { backgroundColor: 'gray.selected' },
                '&.Mui-selected:hover': {
                  backgroundColor: 'gray.selected',
                },
              }}
            >
              {icon && (
                <ListItemIcon
                  sx={{
                    '& .MuiSvgIcon-root': { color: 'inherit' },
                  }}
                >
                  {icon}
                </ListItemIcon>
              )}
              <HStack
                justifyContent="space-between"
                alignItems="center"
                flexWrap="nowrap"
                gap={2}
                flex={1}
                minWidth={0}
              >
                {typeof label === 'string' ? <span>{label}</span> : label}
                {tags.length > 0 && (
                  <HStack alignItems="center" flexShrink={0} gap={0.5}>
                    {tags.map((tag, order) => (
                      <Box component="span" key={order} sx={{ display: 'contents' }}>
                        {tag}
                      </Box>
                    ))}
                  </HStack>
                )}
              </HStack>
            </ListItemButton>
          </Box>
        </Tooltip>
      );
    })}
  </Box>
);
