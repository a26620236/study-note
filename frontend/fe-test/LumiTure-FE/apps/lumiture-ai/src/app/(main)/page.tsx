'use client';

import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import { useTakeScreenshot } from '@shared/hooks';

import CostOverview from '@app/(main)/components/CostOverview';
import NoAuthorization from '@app/(main)/components/NoAuthorization/NoAuthorization';
import OptimizeCloudSpend from '@app/(main)/components/optimize-cloud-spend/OptimizeCloudSpend';
import ScreenshotNotes from '@app/(main)/overview/spending-rankings/components/ScreenshotNotes';
import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import ScreenshotWrapper from '@components/ScreenshotWrapper';
import { useGetResourcesAssignmentStatus } from '@hooks-api';

import { CostByFOCUS } from './components/CostByFOCUS';

export default function Home() {
  const { data: resourcesAssignmentStatus, isLoading: isResourcesAssignmentStatusLoading } =
    useGetResourcesAssignmentStatus();
  const hasAssignedResources = resourcesAssignmentStatus?.data.hasAssignedResources;

  const { screenshotRef, isScreenshotMode, handleTakeScreenshot } = useTakeScreenshot({
    fileName: 'LumiTure_overview',
  });

  return (
    <>
      {isResourcesAssignmentStatusLoading ? (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : hasAssignedResources ? (
        <Stack sx={{ gap: 8 }}>
          <CostOverview onTakeScreenshot={handleTakeScreenshot} />
          <OptimizeCloudSpend />
          <CostByFOCUS />
        </Stack>
      ) : (
        <Stack sx={{ mb: 2, gap: 8, height: '100%' }}>
          <Typography variant="h4">Cloud Cost Overview</Typography>
          <Paper sx={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
            <NoAuthorization
              adminDesc={CUSTOMIZED_EMPTY_CONTENT.overviewNoAuthAdmin.desc}
              nonAdminDesc={CUSTOMIZED_EMPTY_CONTENT.overviewNoAuthNonAdmin.desc}
            />
          </Paper>
        </Stack>
      )}

      {isScreenshotMode && (
        <ScreenshotWrapper ref={screenshotRef}>
          <Stack sx={{ gap: 8 }}>
            <CostOverview isScreenshotMode={true} />
            <OptimizeCloudSpend isScreenshotMode={true} />
            <CostByFOCUS isScreenshotMode={true} />
            <ScreenshotNotes />
          </Stack>
        </ScreenshotWrapper>
      )}
    </>
  );
}
