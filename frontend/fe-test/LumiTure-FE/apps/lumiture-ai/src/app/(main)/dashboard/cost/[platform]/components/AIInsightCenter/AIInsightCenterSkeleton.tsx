import { Box, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';

import { AlertWrapper, Button, HStack, Icon, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

const LABELS = {
  title: 'AI Insight Center',
  button: 'Analysis History',
};

export function AIInsightCenterSkeleton() {
  return (
    <VStack gap={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{LABELS.title}</Typography>
        <Button
          variant="link"
          color="primary"
          startIcon={<Icon name="history" />}
          disabled={true}
          sx={{ '&.MuiButtonBase-root': { backgroundColor: 'transparent' } }}
        >
          <Typography variant="linkBold">{LABELS.button}</Typography>
        </Button>
      </HStack>
      <AlertWrapper boxProps={{ sx: { background: theme.palette.gray.borderLight } }}>
        <HStack gap={4} alignItems="flex-start" justifyContent="space-between" width="100%">
          <VStack gap={1} width="100%" flex={1}>
            <Box py={1}>
              <Skeleton variant="rounded" width={200} height={16} />
            </Box>
            <Box py={0.5}>
              <Skeleton variant="rounded" width="100%" height={14} />
            </Box>
          </VStack>
          <VStack alignItems="center" justifyContent="center" height="100%">
            <Skeleton variant="rounded" height={36} width={120} />
          </VStack>
        </HStack>
      </AlertWrapper>
    </VStack>
  );
}
