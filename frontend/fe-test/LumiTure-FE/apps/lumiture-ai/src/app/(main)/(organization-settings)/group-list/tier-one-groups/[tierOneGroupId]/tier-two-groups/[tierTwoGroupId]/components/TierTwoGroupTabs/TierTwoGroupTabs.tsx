'use client';

import { useState, type SyntheticEvent } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import { Box } from '@mui/material';

import { TabPanel, Tabs } from '@lumiture-ui';

import { tierTwoUsersQueryKey, useGetTierTwoUsers } from '@hooks-api';

import type { TierOneAndTwoGroupParams } from '../../../../../../types/params';
import { TierTwoGroupMembers } from '../TierTwoGroupMembers/TierTwoGroupMembers';
import { TierTwoGroupResources } from '../TierTwoGroupResources';

export function TierTwoGroupTabs() {
  const params = useParams<TierOneAndTwoGroupParams>();
  const { tierOneGroupId, tierTwoGroupId } = params;
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') ?? 'group-members';
  const [tabValue, setTabValue] = useState(initialTab);

  const { data: tierOneUsersQuery } = useGetTierTwoUsers(tierOneGroupId, tierTwoGroupId, {
    queryKey: tierTwoUsersQueryKey(tierOneGroupId, tierTwoGroupId),
    refetchOnWindowFocus: 'always',
  });
  const { resource = 0 } = tierOneUsersQuery?.data.availableActions.counts ?? {};
  const userCount = tierOneUsersQuery?.data.users.length ?? 0;

  const tabItems = [
    {
      value: 'group-members',
      label: `Group Members (${userCount})`,
    },
    {
      value: 'resources',
      label: `Resources (${resource})`,
    },
  ];

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    window.history.replaceState(null, '', `?tab=${newValue}`);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} tabItems={tabItems} />
      <TabPanel value={tabValue} tabKey={tabItems[0].value}>
        <TierTwoGroupMembers />
      </TabPanel>
      <TabPanel value={tabValue} tabKey={tabItems[1].value}>
        <TierTwoGroupResources />
      </TabPanel>
    </Box>
  );
}
