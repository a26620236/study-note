'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';

import { Button, HStack, Icon, ToggleGroup } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { RecommendStatus } from '@hooks-api';

export function RightsizingToggleButtonSkeleton() {
  const toggleButtons = useMemo(() => {
    const statusConfigurations = [
      { status: RecommendStatus.Recommendations, count: 0 },
      { status: RecommendStatus.Done, count: 0 },
      { status: RecommendStatus.Dismiss, count: 0 },
      { status: RecommendStatus.Archived, count: 0 },
    ];

    return statusConfigurations.map(({ status }) => ({
      key: status,
      label: status,
      value: status,
      disabled: true,
      children: (
        <Typography variant="buttonRegular1" color={theme.palette.text.hint}>
          {status}
        </Typography>
      ),
    }));
  }, []);

  const selectedStatus = RecommendStatus.Recommendations;
  return (
    <HStack mt={4} justifyContent="space-between">
      <ToggleGroup toggleButtons={toggleButtons} toggleGroupProps={{ value: selectedStatus }} />
      <Button startIcon={<Icon name="download" />} disabled>
        Export CSV
      </Button>
    </HStack>
  );
}
