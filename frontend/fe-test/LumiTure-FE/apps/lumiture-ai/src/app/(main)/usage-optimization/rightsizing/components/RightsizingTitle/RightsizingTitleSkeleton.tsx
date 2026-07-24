import { Skeleton, Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

const LABELS = {
  title: 'Rightsizing',
};

export function RightsizingTitleSkeleton() {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <Typography variant="h4">{LABELS.title}</Typography>
      <HStack gap={5}>
        <Skeleton variant="rounded" width={140} height={14} />
        <Skeleton variant="rounded" width={200} height={14} />
      </HStack>
    </HStack>
  );
}
