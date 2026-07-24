import { Skeleton } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

export function RecommendedInstanceCostsSkeleton() {
  return (
    <HStack gap={2} justifyContent="space-between">
      <VStack flexGrow={1}>
        <Skeleton width="100%" height={106} />
      </VStack>
      <VStack flexGrow={1}>
        <Skeleton width="100%" height={106} />
      </VStack>
      <VStack flexGrow={1}>
        <Skeleton width="100%" height={106} />
      </VStack>
      <VStack flexGrow={1}>
        <Skeleton width="100%" height={106} />
      </VStack>
      <VStack flexGrow={1}>
        <Skeleton width="100%" height={106} />
      </VStack>
    </HStack>
  );
}
