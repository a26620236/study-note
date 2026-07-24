import { Box, Tooltip, Typography } from '@mui/material';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';

import { LABELS } from './RightsizingListHeaderSkeleton';

export function RightsizingListHeader() {
  return (
    <VStack mt={8}>
      <HStack gap={2.5}>
        <Typography variant="h4">{LABELS.title}</Typography>
        <Tooltip
          title={
            <Box sx={{ width: 400 }}>
              <Markdown>{LABELS.tooltip}</Markdown>
            </Box>
          }
        >
          <HStack alignItems="center" justifyContent="center">
            <Icon name="info" sx={{ fontSize: 16, color: 'text.secondary' }} />
          </HStack>
        </Tooltip>
      </HStack>
      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          {LABELS.description}
        </Typography>
      </Box>
    </VStack>
  );
}
