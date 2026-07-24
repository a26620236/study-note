import { Button, Paper, Skeleton, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';

import { PlatformResourceSkeleton } from './RightsizingScope/PlatformResourceSkeleton';

const LABELS = {
  button: {
    reset: 'Reset',
    discardChanges: 'Discard Changes',
    save: 'Save',
    addNewScope: 'Add New Scope',
  },
  rightsizingScope: 'Rightsizing Scope',
  criteriaSettings: 'Criteria Settings',
  advancedSettings: 'Advanced Settings',
};

export function RightsizingSettingsSkeleton() {
  return (
    <VStack sx={{ gap: 5 }}>
      <HStack sx={{ justifyContent: 'space-between', alignItems: 'end' }}>
        <Skeleton variant="rounded" width={400} height={18} />
        <Button startIcon={<Icon name="add" />} disabled>
          {LABELS.button.addNewScope}
        </Button>
      </HStack>
      <Paper>
        <VStack gap={4}>
          <HStack gap={2}>
            <Typography variant="h5">{LABELS.rightsizingScope}</Typography>
            <Skeleton variant="rounded" width={77} height={24} />
          </HStack>
          <Skeleton variant="rounded" width={100} height={12} />
          <Skeleton variant="rounded" width="100%" height={36} />
          <PlatformResourceSkeleton />
        </VStack>
      </Paper>
      <Paper>
        <VStack sx={{ gap: 4 }}>
          <HStack sx={{ gap: 2, alignItems: 'center' }}>
            <Typography variant="h5">{LABELS.criteriaSettings}</Typography>
            <Skeleton variant="rounded" width={78} height={16} />
          </HStack>
          <Skeleton variant="rounded" width="100%" height={120} />
          <Skeleton variant="rounded" width="100%" height={36} />
          <Skeleton variant="rounded" width="100%" height={36} />
        </VStack>
      </Paper>
      <Paper>
        <VStack sx={{ gap: 4 }}>
          <HStack sx={{ gap: 2, alignItems: 'center' }}>
            <Typography variant="h5">{LABELS.advancedSettings}</Typography>
            <Skeleton variant="rounded" width={78} height={16} />
          </HStack>
          <HStack sx={{ gap: 4 }}>
            <VStack sx={{ gap: 2, flex: 1 }}>
              <Skeleton variant="rounded" width={100} height={12} />
              <Skeleton variant="rounded" width="100%" height={36} />
            </VStack>
            <VStack sx={{ gap: 2, flex: 1 }}>
              <Skeleton variant="rounded" width={100} height={12} />
              <Skeleton variant="rounded" width="100%" height={36} />
            </VStack>
          </HStack>
          <Skeleton variant="rounded" width="100%" height={120} />
        </VStack>
      </Paper>
    </VStack>
  );
}
