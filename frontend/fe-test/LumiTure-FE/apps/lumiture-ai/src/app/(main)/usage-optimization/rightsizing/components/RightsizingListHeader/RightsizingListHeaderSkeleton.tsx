import { Box, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';

export const LABELS = {
  title: 'Rightsizing Recommendation List',
  description:
    'Certain resources might be used for backup or load balancing. Please verify the usage before applying changes.',
  tooltip:
    'Recommendations are displayed in order of <br /><strong>Recommendation Date</strong>, with the most recent on top.<br />For recommendations from the same date, those with a <br />higher Estimated Avoidance amount appear first.',
};

export function RightsizingListHeaderSkeleton() {
  return (
    <VStack mt={8}>
      <HStack gap={2.5} alignItems="center">
        <Typography variant="h4">{LABELS.title}</Typography>
        <Icon name="info" sx={{ fontSize: 16, color: 'text.secondary' }} />
      </HStack>
      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          {LABELS.description}
        </Typography>
      </Box>
    </VStack>
  );
}
