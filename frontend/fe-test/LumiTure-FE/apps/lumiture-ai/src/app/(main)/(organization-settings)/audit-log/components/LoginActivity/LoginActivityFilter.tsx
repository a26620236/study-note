'use client';

import { Button } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { useLoginActivityStore } from '../../hooks/useLoginActivityStore';
import { LoginActivityDateFilter } from './LoginActivityDateFilter';
import { LoginActivitySearch } from './LoginActivitySearch';
import { LoginActivitySelectFilters } from './LoginActivitySelectFilters';

const LABELS = {
  reset: 'Reset',
};

export function LoginActivityFilter() {
  const { resetFilters } = useLoginActivityStore();

  return (
    <HStack justifyContent="space-between">
      <HStack gap={2}>
        <LoginActivitySelectFilters />
        <LoginActivityDateFilter />
        <Button variant="link" onClick={resetFilters}>
          {LABELS.reset}
        </Button>
      </HStack>
      <LoginActivitySearch />
    </HStack>
  );
}
