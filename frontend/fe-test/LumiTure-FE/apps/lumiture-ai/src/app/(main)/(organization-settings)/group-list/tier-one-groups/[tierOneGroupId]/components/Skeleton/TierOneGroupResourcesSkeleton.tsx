'use client';

import { InputAdornment, Typography } from '@mui/material';
import Button from '@mui/material/Button';

import { HStack, Icon, Input, Tabs, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';
import { AWS, AZURE, GCP } from '@constants';

import { LABELS } from '../TierOneGroupResources';
import { TabsSkeleton } from './TabsSkeleton';

const SEARCH_LABELS = {
  searchPlaceholder: 'Search resources',
};

export function TierOneGroupResourcesSkeleton() {
  const CLOUD_PROVIDER_OPTIONS = [GCP, AWS, AZURE];
  return (
    <>
      <TabsSkeleton tabValue="resources" />
      <VStack gap={4} mt={4}>
        <HStack justifyContent="space-between" alignItems="center" height={36}>
          <Typography variant="caption" color="text.secondary">
            {LABELS.description}
          </Typography>
        </HStack>
        <Tabs value={CLOUD_PROVIDER_OPTIONS[0].value} tabItems={CLOUD_PROVIDER_OPTIONS} />
        <HStack justifyContent="space-between">
          <Input
            placeholder={SEARCH_LABELS.searchPlaceholder}
            disabled
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
          <Button variant="contained" color="primary" startIcon={<Icon name="add" />} disabled>
            Assign Resource
          </Button>
        </HStack>
        <TableSkeleton rows={6} columns={3} />
      </VStack>
    </>
  );
}
