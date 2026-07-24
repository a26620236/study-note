'use client';

import { useEffect, useState } from 'react';

import { InputAdornment } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { Icon, Input } from '@lumiture-ui';

import { useLoginActivityStore } from '../../hooks/useLoginActivityStore';

const MIN_SEARCH_LENGTH = 3;

export const SEARCH_LABELS = {
  searchPlaceholder: 'Search',
  searchMinLengthError: `Enter at least ${MIN_SEARCH_LENGTH} characters`,
};

export function LoginActivitySearch() {
  const { filters, setFilters } = useLoginActivityStore();

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
    <Input
      placeholder={SEARCH_LABELS.searchPlaceholder}
      value={searchText}
      onChange={handleSearchChange}
      error={hasError}
      helperText={hasError ? SEARCH_LABELS.searchMinLengthError : undefined}
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
  );
}
