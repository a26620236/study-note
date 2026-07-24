import { Paper, Skeleton, Typography } from '@mui/material';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';
import { PLATFORM_CONFIG, PlatformsValue } from '@constants';

import { SyncStatusIcon } from './SyncStatusIcon';

const LABELS = {
  platformLabels: {
    [PlatformsValue.GCP]: 'Google Cloud',
    [PlatformsValue.AWS]: 'AWS',
    [PlatformsValue.AZURE]: 'Azure',
  },
  buttonLabel: 'Add Authorization',
};

function SectionSkeletonHeader({ platform }: { platform: PlatformsValue }) {
  const PlatformIcon = PLATFORM_CONFIG[platform].icon;

  return (
    <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <HStack sx={{ alignItems: 'center', gap: 2 }}>
        <PlatformIcon />
        <Typography variant="h5">{LABELS.platformLabels[platform]}</Typography>
      </HStack>
      <HStack sx={{ gap: 2 }}>
        <SyncStatusIcon disabled />
        <Button disabled endIcon={<Icon name="arrow_drop_down" />}>
          {LABELS.buttonLabel}
        </Button>
      </HStack>
    </HStack>
  );
}

export function AuthorizationListSkeleton() {
  return (
    <VStack sx={{ gap: 8 }}>
      {Object.values(PlatformsValue).map((platform) => (
        <VStack key={platform} sx={{ gap: 3 }}>
          <SectionSkeletonHeader platform={platform} />
          <Paper>
            <VStack sx={{ gap: 7 }}>
              <Skeleton variant="rounded" width={200} height={16} />
              <TableSkeleton rows={3} columns={5} />
            </VStack>
          </Paper>
        </VStack>
      ))}
    </VStack>
  );
}
