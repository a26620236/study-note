import { HStack } from '@lumiture-ui';

import { AllocationAccuracyIndex } from './AllocationAccuracyIndex';
import { UntaggedCost } from './UntaggedCost';

export function LumiTagSummary() {
  return (
    <HStack gap="16px" mt="16px" width="100%">
      <AllocationAccuracyIndex />
      <UntaggedCost />
    </HStack>
  );
}
