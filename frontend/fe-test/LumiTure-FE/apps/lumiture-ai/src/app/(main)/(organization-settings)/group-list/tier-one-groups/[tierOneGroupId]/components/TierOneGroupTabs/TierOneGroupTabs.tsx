'use client';

import { useState, type SyntheticEvent } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import { Box } from '@mui/material';

import { TabPanel, Tabs } from '@lumiture-ui';

import { useGetTierOneUsers } from '@hooks-api';

import type { TierOneGroupParams } from '../../../../types/params';
import { TierOneGroupMembers } from '../TierOneGroupMembers/TierOneGroupMembers';
import { TierOneGroupResources } from '../TierOneGroupResources';
import { TierTwoGroupsTable } from '../TierTwoGroupsTable/TierTwoGroupsTable';

export function TierOneGroupTabs() {
  const params = useParams<TierOneGroupParams>();
  const searchParams = useSearchParams();
  const { tierOneGroupId } = params;
  const initialTab = searchParams.get('tab') ?? 'group-members';

  const [tabValue, setTabValue] = useState(initialTab);

  const { data: tierOneUsersQuery } = useGetTierOneUsers(tierOneGroupId);
  const { resource = 0, tier2Group = 0 } = tierOneUsersQuery?.data.availableActions.counts ?? {};
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
    {
      value: 'tier-2-groups',
      label: `Tier 2 Groups (${tier2Group})`,
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
        <TierOneGroupMembers />
      </TabPanel>
      <TabPanel value={tabValue} tabKey={tabItems[1].value}>
        <TierOneGroupResources />
      </TabPanel>
      <TabPanel value={tabValue} tabKey={tabItems[2].value}>
        <TierTwoGroupsTable />
      </TabPanel>
    </Box>
  );
}
