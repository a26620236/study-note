import { Suspense } from 'react';

import { InstructionButton, InstructionName } from '@features';
import { Box, Paper } from '@mui/material';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import { tierOneUsersQueryFn, tierOneUsersQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { TierOneGroupMembersSkeleton } from './components/Skeleton/TierOneGroupMembersSkeleton';
import { TierOneGroupResourcesSkeleton } from './components/Skeleton/TierOneGroupResourcesSkeleton';
import { TierTwoGroupsTableSkeleton } from './components/Skeleton/TierTwoGroupsTableSkeleton';
import { TierOneGroupHeader } from './components/TierOneGroupHeader';
import { TierOneGroupTabsHydration } from './components/TierOneGroupTabs/TierOneGroupTabsHydration';

const DEFAULT_TAB = 'group-members';

interface TierOneUsersPageProps {
  params: Promise<{
    tierOneGroupId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function TierOneGroupsInfo({ params, searchParams }: TierOneUsersPageProps) {
  const { tierOneGroupId } = await params;
  const { tab } = await searchParams;
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: tierOneUsersQueryKey(tierOneGroupId),
    queryFn: async () => await tierOneUsersQueryFn(tierOneGroupId, headers),
  });

  const currentTab = tab ?? DEFAULT_TAB;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VStack data-testid="group-list-tier-one-groups-info">
        <Box>
          <GoBack content="Back to Group List" url="/group-list/tier-one-groups" />
        </Box>
        <Paper>
          <VStack gap={8}>
            <TierOneGroupHeader tierOneGroupId={tierOneGroupId} />
            <Box>
              <Suspense fallback={<Skeleton tab={currentTab} />}>
                <TierOneGroupTabsHydration tierOneGroupId={tierOneGroupId} />
              </Suspense>
            </Box>
            <VStack gap={2}>
              <InstructionButton name={InstructionName.OrgAndRole} />
              <InstructionButton name={InstructionName.AuthAndResourceAssignment} />
            </VStack>
          </VStack>
        </Paper>
      </VStack>
    </HydrationBoundary>
  );
}

interface SkeletonProps {
  tab: string;
}

function Skeleton({ tab }: SkeletonProps) {
  if (tab === 'group-members') {
    return <TierOneGroupMembersSkeleton />;
  }
  if (tab === 'resources') {
    return <TierOneGroupResourcesSkeleton />;
  }
  if (tab === 'tier-2-groups') {
    return <TierTwoGroupsTableSkeleton />;
  }
  return null;
}
