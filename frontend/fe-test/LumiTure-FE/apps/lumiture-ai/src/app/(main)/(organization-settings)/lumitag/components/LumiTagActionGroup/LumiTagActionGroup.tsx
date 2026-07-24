'use client';

import { useCallback, useState, type ChangeEvent, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import { InputAdornment, TextField } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { BadgeToggleGroup, Button, HStack, Icon } from '@lumiture-ui';

import { ORG_SETTINGS_PATHS } from '@constants';
import { LumiTagStatus, useGetLumiTagList, type LumiTagItem } from '@hooks-api';

import { useLumiTagStore } from '../../hooks/useLumiTagStore';
import { getToggleButtons } from './LumiTagActionGroupSkeleton';

const LABELS = {
  searchPlaceholder: 'Search LumiTag',
  createButton: 'Create LumiTag',
};

export const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    padding: '0px 8px',
    '& .Mui-disabled': {
      borderColor: 'gray.border',
      color: 'gray.disableDark',
      bgcolor: 'gray.disableLight',
      opacity: 0.6,
    },
  },
  '& .MuiInputBase-input': {
    width: '200px',
    '&::placeholder': {
      color: 'text.hint',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '21px',
    },
  },
};

export function LumiTagActionGroup() {
  const router = useRouter();
  const { selectedStatus, setSelectedStatus, setSearchText } = useLumiTagStore();
  const { data } = useGetLumiTagList();

  const [inputText, setInputText] = useState('');

  const tags = data?.data.tags ?? [];
  const allCount = tags.length;
  const activeCount = tags.filter((tag: LumiTagItem) => tag.status === LumiTagStatus.Active).length;
  const inactiveCount = allCount - activeCount;

  const toggleButton = getToggleButtons({
    all: allCount,
    active: activeCount,
    inactive: inactiveCount,
  });

  const debouncedSetSearchText = useDebounceCallback(setSearchText, 500);

  const handleStatusChange = useCallback(
    (_event: MouseEvent<HTMLElement>, value: LumiTagStatus | null) => {
      if (!value) return;
      setSelectedStatus(value);
    },
    [setSelectedStatus]
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputText(event.target.value);
      debouncedSetSearchText(event.target.value);
    },
    [debouncedSetSearchText]
  );

  const handleCreateClick = useCallback(() => {
    router.push(ORG_SETTINGS_PATHS.lumiTagSettings.pathname);
  }, [router]);

  return (
    <HStack mt={8} justifyContent="space-between" alignItems="center">
      <BadgeToggleGroup
        toggleGroupProps={{
          value: selectedStatus,
          onChange: handleStatusChange,
          exclusive: true,
        }}
        toggleButtons={toggleButton}
      />
      <HStack gap={2} alignItems="center">
        <TextField
          placeholder={LABELS.searchPlaceholder}
          value={inputText}
          onChange={handleSearchChange}
          variant="outlined"
          size="medium"
          sx={textFieldStyle}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon name="search" sx={{ color: 'text.hint', fontSize: '20px' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button onClick={handleCreateClick}>{LABELS.createButton}</Button>
      </HStack>
    </HStack>
  );
}
