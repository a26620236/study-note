import type { ChangeEvent, ReactNode } from 'react';

import { InputBase } from '@mui/material';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { Icon } from '../Icon';

export interface BaseSelectMenuProps {
  width?: number | string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchInputValue?: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

export function BaseSelectMenu({
  width = 'auto',
  enableSearch = true,
  searchPlaceholder = '',
  searchInputValue = '',
  onSearchChange,
  children,
}: BaseSelectMenuProps) {
  return (
    <Stack sx={{ p: 2.5, width }}>
      {enableSearch && (
        <>
          <InputBase
            endAdornment={<Icon name="search" sx={{ color: 'text.hint' }} />}
            sx={{ mb: 2.5 }}
            value={searchInputValue}
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
          />
          <Divider />
        </>
      )}
      {children}
    </Stack>
  );
}
