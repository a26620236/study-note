import { Box, Grid } from '@mui/material';

import { CostAvoidanceToDate } from './CostAvoidanceToDate';
import { CurrentMonthlyCostAvoidance } from './CurrentMonthlyCostAvoidance';
import { OptimizationCompleted } from './OptimizationCompleted';
import { OptimizationScore } from './OptimizationScore';

export function RightsizingSummary() {
  return (
    <Box mt={4}>
      <Grid container spacing={4}>
        <Grid size={3}>
          <OptimizationScore />
        </Grid>
        <Grid size={3}>
          <OptimizationCompleted />
        </Grid>
        <Grid size={3}>
          <CurrentMonthlyCostAvoidance />
        </Grid>
        <Grid size={3}>
          <CostAvoidanceToDate />
        </Grid>
      </Grid>
    </Box>
  );
}
