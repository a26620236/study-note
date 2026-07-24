import { Skeleton } from '@mui/material';

import { HStack } from '@lumiture-ui';

export function PlatformResourceSkeleton() {
  return (
    <HStack gap={4}>
      <Skeleton variant="rounded" height={138} sx={{ flex: 1, borderRadius: 2 }} />
      <Skeleton variant="rounded" height={138} sx={{ flex: 1, borderRadius: 2 }} />
      <Skeleton variant="rounded" height={138} sx={{ flex: 1, borderRadius: 2 }} />
    </HStack>
  );
}
