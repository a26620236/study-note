'use client';

import { Box } from '@mui/material';

import { useGetResourcesAssignmentStatus } from '@hooks-api';

import { RightsizingToggleButton } from '../RightsizingActionGroup/RightsizingToggleButton';
import { RightsizingInfoBanner } from '../RightsizingInfoBanner/RightsizingInfoBanner';
import { RightsizingScanLimitBanner } from '../RightsizingInfoBanner/RightsizingScanLimitBanner';
import { RightsizingListHeader } from '../RightsizingListHeader/RightsizingListHeader';
import { RightsizingSummary } from '../RightsizingSummary/RightsizingSummary';
import { RightsizingTable } from '../RightsizingTable/RightsizingTable';
import { RightsizingTitle } from '../RightsizingTitle/RightsizingTitle';
import { RightsizingNoAuth } from './RightsizingNoAuth';

export function Rightsizing() {
  const { data: resourcesAssignmentStatus } = useGetResourcesAssignmentStatus();
  const hasAssignedResources = resourcesAssignmentStatus?.data.hasAssignedResources;

  if (!hasAssignedResources) {
    return <RightsizingNoAuth />;
  }

  return (
    <Box>
      <RightsizingTitle />
      <RightsizingInfoBanner />
      <RightsizingScanLimitBanner />
      <RightsizingSummary />
      <RightsizingListHeader />
      <RightsizingToggleButton />
      <RightsizingTable />
    </Box>
  );
}
