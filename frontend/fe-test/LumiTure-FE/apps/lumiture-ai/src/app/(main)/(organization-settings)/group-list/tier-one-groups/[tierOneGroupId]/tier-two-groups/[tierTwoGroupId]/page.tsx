import { Suspense } from 'react';

import { InstructionButton, InstructionName } from '@features';
import { Box, Paper } from '@mui/material';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import { Depth } from '@constants';
import { tierTwoUsersQueryFn, tierTwoUsersQueryKey } from '@hooks-api';
import { authOptions, getServerAuthHeaders } from '@utils';

import { TierTwoGroupMembersSkeleton } from './components/Skeleton/TierTwoGroupMembersSkeleton';
import { TierTwoGroupResourcesSkeleton } from './components/Skeleton/TierTwoGroupResourcesSkeleton';
import { TierTwoGroupHeader } from './components/TierTwoGroupHeader';
import { TierTwoGroupTabsHydration } from './components/TierTwoGroupTabs/TierTwoGroupTabsHydration';

const DEFAULT_TAB = 'group-members';

interface TierTwoGroupsPageProps {
  params: Promise<{
    tierOneGroupId: string;
    tierTwoGroupId: string;
  }>;
  searchParams: Promise<{
    tab: string;
  }>;
}

export default async function TierTwoGroupsInfo({ params, searchParams }: TierTwoGroupsPageProps) {
  const { tierOneGroupId, tierTwoGroupId } = await params;
  const { tab } = await searchParams;
  const session = await getServerSession(authOptions);
  const userDepth = session?.user.group?.depth ?? 0;
  const hasTierOneGroupSession = userDepth <= Depth.T1;

  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: tierTwoUsersQueryKey(tierOneGroupId, tierTwoGroupId),
    queryFn: async () => await tierTwoUsersQueryFn(tierOneGroupId, tierTwoGroupId, headers),
  });

  const currentTab = tab || DEFAULT_TAB;

  const backUrl = hasTierOneGroupSession
    ? `/group-list/tier-one-groups`
    : `/group-list/tier-one-groups/${tierOneGroupId}/tier-two-groups`;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VStack data-testid="group-list-tier-two-groups-info">
        <Box>
          <GoBack content="Back to Group List" url={backUrl} />
        </Box>
        <Paper>
          <VStack gap={8}>
            <TierTwoGroupHeader tierOneGroupId={tierOneGroupId} tierTwoGroupId={tierTwoGroupId} />
            <Box>
              <Suspense fallback={<Skeleton tab={currentTab} />}>
                <TierTwoGroupTabsHydration tierTwoGroupId={tierTwoGroupId} />
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
    return <TierTwoGroupMembersSkeleton />;
  }
  if (tab === 'resources') {
    return <TierTwoGroupResourcesSkeleton />;
  }
  return null;
}
