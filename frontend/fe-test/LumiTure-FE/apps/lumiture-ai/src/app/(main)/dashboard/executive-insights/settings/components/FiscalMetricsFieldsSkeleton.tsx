import { Grid, Paper, Skeleton, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

const LABELS = {
  CloudValueRealization: 'Cloud Value Realization',
  CloudSpendRevenue: 'Cloud Spend as a % of Revenue',
  CloudCostPerCustomer: 'Cloud Cost per Customer',
  CloudCostForecast: 'Cloud Cost Forecast & Variance',
};

function FieldSkeleton() {
  return (
    <VStack sx={{ gap: 2 }}>
      <Skeleton variant="rectangular" sx={{ borderRadius: '4px', width: '66%', height: '12px' }} />
      <Skeleton variant="rectangular" sx={{ borderRadius: '4px', width: '100%', height: '36px' }} />
    </VStack>
  );
}

export function FiscalMetricsFieldsSkeleton() {
  return (
    <VStack sx={{ gap: 4, width: '100%' }}>
      <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: '4px', width: '400px', height: '18px' }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: '8px', width: '360px', height: '40px' }}
        />
      </HStack>
      {Object.entries(LABELS).map(([key, value]) => (
        <Paper key={key}>
          <VStack sx={{ gap: 4 }}>
            <Typography variant="h5">{value}</Typography>
            <Grid container rowGap="10px" columnSpacing="20px">
              {Array.from({ length: 12 }, (_, index) => (
                <Grid key={index} size={2}>
                  <FieldSkeleton />
                </Grid>
              ))}
            </Grid>
          </VStack>
        </Paper>
      ))}
    </VStack>
  );
}
