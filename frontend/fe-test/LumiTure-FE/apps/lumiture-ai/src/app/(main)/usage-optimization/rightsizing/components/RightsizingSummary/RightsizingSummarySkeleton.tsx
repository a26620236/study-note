import type { ReactNode } from 'react';

import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';

import { PAPER_HEIGHT } from '../../constants/rightsizing';

const LABELS = {
  optimizationScore: 'Optimization Score',
  optimizationCompleted: 'Optimization Completed',
  currentMonthlyAvoidance: 'Current Monthly Cost Avoidance',
  actualAvoidanceDate: 'Cost Avoidance to Date',
};

export function RightsizingSummarySkeleton() {
  return (
    <Box flexGrow={1} mt={4}>
      <Grid container spacing={4}>
        <Grid size={3}>
          <SkeletonPaper
            title={
              <HStack alignItems="center" flexWrap="nowrap" gap={1}>
                <Typography variant="captionBold" color="text.secondary">
                  {LABELS.optimizationScore}
                </Typography>
                <Icon name="info" sx={{ fontSize: 16, color: 'text.hint', cursor: 'pointer' }} />
              </HStack>
            }
          />
        </Grid>
        <Grid size={3}>
          <SkeletonPaper
            title={
              <Typography variant="captionBold" color="text.secondary">
                {LABELS.optimizationCompleted}
              </Typography>
            }
          />
        </Grid>
        <Grid size={3}>
          <SkeletonPaper
            title={
              <Typography variant="captionBold" color="text.secondary">
                {LABELS.currentMonthlyAvoidance}
              </Typography>
            }
          />
        </Grid>
        <Grid size={3}>
          <SkeletonPaper
            title={
              <Typography variant="captionBold" color="text.secondary">
                {LABELS.actualAvoidanceDate}
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}

interface SkeletonPaperProps {
  title: ReactNode;
}

const SkeletonPaper = ({ title }: SkeletonPaperProps) => (
  <Paper sx={{ padding: '24px', height: PAPER_HEIGHT }}>
    <VStack>
      {title}
      <Skeleton variant="rounded" height={36} sx={{ mt: 4, borderRadius: 2 }} />
      <Skeleton variant="rounded" height={14} sx={{ mt: 4, borderRadius: 2 }} />
    </VStack>
  </Paper>
);
