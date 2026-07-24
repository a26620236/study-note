'use client';

import { useEffect, useState } from 'react';

import { InputAdornment } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { HStack, Icon, Input } from '@lumiture-ui';

import { useUserActivityStore } from '../../hooks/useUserActivityStore';

const MIN_SEARCH_LENGTH = 3;

const LABELS = {
  searchPlaceholder: 'Search',
  searchMinLengthError: `Enter at least ${MIN_SEARCH_LENGTH} characters`,
};

export function UserActivitySearch() {
  const { filters, setFilters } = useUserActivityStore();

  const [searchText, setSearchText] = useState(filters.search);

  useEffect(() => {
    setSearchText(filters.search);
  }, [filters.search]);

  const debouncedSetSearch = useDebounceCallback((value: string) => {
    if (value.length > 0 && value.length < MIN_SEARCH_LENGTH) return;
    setFilters({ search: value });
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    debouncedSetSearch(event.target.value);
  };

  const hasError = searchText.length > 0 && searchText.length < MIN_SEARCH_LENGTH;

  return (
    <HStack>
      <Input
        placeholder={LABELS.searchPlaceholder}
        value={searchText}
        onChange={handleSearchChange}
        error={hasError}
        helperText={hasError ? LABELS.searchMinLengthError : undefined}
        slotProps={{
          input: {
            sx: { width: '240px' },
            endAdornment: (
              <InputAdornment position="end">
                <Icon name="search" />
              </InputAdornment>
            ),
          },
        }}
      />
    </HStack>
  );
}
