import { Skeleton } from '@mui/material';

import { HStack } from '@lumiture-ui';

export function RecommendationSummarySkeleton() {
  return (
    <>
      <HStack py={1}>
        <Skeleton variant="text" width={200} height={16} />
      </HStack>
      <HStack py="5px">
        <Skeleton variant="text" width={400} height={20} />
      </HStack>
      <HStack py="5.25px">
        <Skeleton variant="text" width={400} height={14} />
      </HStack>
      <HStack py="3px">
        <Skeleton variant="text" width={200} height={12} />
      </HStack>
    </>
  );
}
