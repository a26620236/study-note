import { useMemo } from 'react';

import { Paper, Skeleton, Typography } from '@mui/material';

import { Button, HStack, Icon, ToggleGroup, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { AnomalyToggleCategory } from '../constants';

const LABELS = {
  title: 'Alert List',
  button: 'Alert Settings',
};

export function AnomalySkeleton() {
  const toggleButtons = useMemo(
    () => [
      {
        value: AnomalyToggleCategory.All,
        children: (
          <Typography variant="button" sx={{ textTransform: 'none' }}>
            All
          </Typography>
        ),
        disabled: true,
      },
      {
        value: AnomalyToggleCategory.Pinned,
        children: <Icon name="keep" sx={{ fontSize: '20px' }} />,
        disabled: true,
      },
    ],
    []
  );

  return (
    <Paper>
      <VStack gap={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{LABELS.title}</Typography>
          <HStack alignItems="center" sx={{ ml: 'auto' }} gap={4}>
            <Button
              variant="link"
              size="medium"
              startIcon={<Icon name="settings" />}
              disabled
              sx={{
                '&.MuiButtonBase-root': { padding: '0' },
              }}
            >
              <Typography variant="bodyBold">{LABELS.button}</Typography>
            </Button>
            <Skeleton variant="rounded" width={224} height={14} />
            <ToggleGroup
              toggleGroupProps={{
                value: '',
              }}
              toggleButtons={toggleButtons}
            />
          </HStack>
        </HStack>
        <TableSkeleton rows={5} />
      </VStack>
    </Paper>
  );
}
