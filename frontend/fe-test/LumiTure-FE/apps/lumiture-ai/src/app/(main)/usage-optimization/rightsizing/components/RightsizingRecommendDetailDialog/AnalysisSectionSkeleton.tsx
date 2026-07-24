import { Grid, Skeleton } from '@mui/material';

import { HStack } from '@lumiture-ui';

export function UsageAnalysisSkeleton() {
  return (
    <Grid container columns={5} spacing={2}>
      <Grid size={1}>
        <HStack py="5.25px">
          <Skeleton height="14px" width="100%" />
        </HStack>
      </Grid>
      <Grid size={1}>
        <HStack py="5.25px">
          <Skeleton height="14px" width="100%" />
        </HStack>
      </Grid>
      <Grid size={1}>
        <HStack py="5.25px">
          <Skeleton height="14px" width="100%" />
        </HStack>
      </Grid>
      <Grid size={1}>
        <HStack py="5.25px">
          <Skeleton height="14px" width="100%" />
        </HStack>
      </Grid>
      <Grid size={1}>
        <HStack py="5.25px">
          <Skeleton height="14px" width="100%" />
        </HStack>
      </Grid>
    </Grid>
  );
}

export function DetailedAnalysisSkeleton() {
  return <Skeleton height={77} />;
}
