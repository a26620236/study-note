'use client';

import { Button } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { useUserActivityStore } from '../../hooks/useUserActivityStore';
import { UserActivityDateFilter } from './UserActivityDateFilter';
import { UserActivitySearch } from './UserActivitySearch';
import { UserActivitySelectFilters } from './UserActivitySelectFilters';

const LABELS = {
  reset: 'Reset',
};

export function UserActivityFilter() {
  const { resetFilters } = useUserActivityStore();

  return (
    <HStack justifyContent="space-between">
      <HStack gap={2}>
        <UserActivitySelectFilters />
        <UserActivityDateFilter />
        <Button variant="link" onClick={resetFilters}>
          {LABELS.reset}
        </Button>
      </HStack>
      <UserActivitySearch />
    </HStack>
  );
}
