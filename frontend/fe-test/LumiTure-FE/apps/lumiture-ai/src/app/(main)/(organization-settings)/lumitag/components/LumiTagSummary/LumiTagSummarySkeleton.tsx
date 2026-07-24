import { Box, Paper, Skeleton, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';

const LABELS = ['Allocation Accuracy Index', 'Untagged Cost'];

const SkeletonPaper = ({ label }: { label: string }) => (
  <Paper sx={{ padding: '24px', flex: 1 }}>
    <VStack>
      <HStack alignItems="center" flexWrap="nowrap" gap={1}>
        <Typography variant="captionBold" color="text.secondary">
          {label}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon name="info" sx={{ fontSize: 16, color: 'text.hint', cursor: 'pointer' }} />
        </Box>
      </HStack>
      <Skeleton variant="rounded" height={36} sx={{ mt: 4, borderRadius: 2 }} />
      <HStack justifyContent="flex-end">
        <Skeleton variant="rounded" width={100} height={14} sx={{ mt: 4, borderRadius: 2 }} />
      </HStack>
    </VStack>
  </Paper>
);

export function LumiTagSummarySkeleton() {
  return (
    <HStack gap={4} mt={4} width="100%">
      {LABELS.map((label) => (
        <SkeletonPaper key={label} label={label} />
      ))}
    </HStack>
  );
}
