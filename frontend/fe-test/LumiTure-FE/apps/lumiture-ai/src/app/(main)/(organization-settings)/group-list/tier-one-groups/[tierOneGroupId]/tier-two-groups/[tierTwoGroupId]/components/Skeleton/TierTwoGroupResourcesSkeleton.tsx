'use client';

import { Typography } from '@mui/material';
import Button from '@mui/material/Button';

import { HStack, Icon, Tabs, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';
import { AWS, GCP } from '@constants';

import { LABELS } from '../TierTwoGroupResources';
import { TabsSkeleton } from './TabsSkeleton';

export function TierTwoGroupResourcesSkeleton() {
  const CLOUD_PROVIDER_OPTIONS = [GCP, AWS];
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
        <HStack justifyContent="flex-end">
          <Button variant="contained" color="primary" startIcon={<Icon name="add" />} disabled>
            Assign Resource
          </Button>
        </HStack>
        <TableSkeleton rows={8} columns={3} />
      </VStack>
    </>
  );
}
