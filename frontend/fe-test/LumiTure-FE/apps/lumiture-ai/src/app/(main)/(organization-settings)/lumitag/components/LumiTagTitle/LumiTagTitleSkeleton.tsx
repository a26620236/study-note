import { Skeleton, Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

export function LumiTagTitleSkeleton() {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <Typography variant="h4">LumiTag</Typography>
      <Skeleton variant="rounded" width={200} height={14} />
    </HStack>
  );
}
