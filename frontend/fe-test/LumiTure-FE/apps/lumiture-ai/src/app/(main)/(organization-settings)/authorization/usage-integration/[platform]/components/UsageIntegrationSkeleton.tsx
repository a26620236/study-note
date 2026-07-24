import { Skeleton, Stack } from '@mui/material';

export function UsageIntegrationSkeleton() {
  return (
    <Stack gap={4}>
      <Skeleton variant="rounded" height={40} width={300} />
      <Skeleton variant="rounded" height={80} />
      <Skeleton variant="rounded" height={200} />
      <Skeleton variant="rounded" height={200} />
    </Stack>
  );
}
