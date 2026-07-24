'use client';

import { useParams } from 'next/navigation';

import { Box, Skeleton, Typography } from '@mui/material';

import { Button, HStack, Icon, Tabs, ToggleGroup, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';
import type { PlatformsValue } from '@constants';

import { MonthlyViewMode, PLATFORM_TAB_CONFIG, VIEW_MODE_OPTIONS } from '../../constants/budget';

const LABELS = {
  tier1GroupBudget: 'Tier 1 Group Budget',
  downloadCsv: 'Download CSV',
  editBudget: 'Edit Budget',
  alertNote: 'You will receive alert when the cost reach, 60, 80, 90 % of the monthly budget.',
  alertSettings: 'Alert Settings',
  monthlyView: 'Monthly View',
  [MonthlyViewMode.Budget]: 'Budget',
  [MonthlyViewMode.Spend]: 'Spend',
  [MonthlyViewMode.Remaining]: 'Remaining',
  unlimitedNote:
    '*When the budget input field is left blank or shows "--", it indicates that no budget limit has been set (unlimited).',
};

const MonthlyViewControlSkeleton = () => (
  <HStack justifyContent="space-between" alignItems="center" sx={{ mt: 4, mb: 6 }}>
    <Skeleton width={260} height={24} />
    <HStack gap={2} alignItems="center">
      <Typography variant="bodyBold" color="text.secondary">
        {LABELS.monthlyView}
      </Typography>
      {/* 編輯模式鎖定 Budget 視角，不提供切換 */}
      <ToggleGroup
        toggleGroupProps={{
          exclusive: true,
          size: 'small',
          disabled: true,
        }}
        toggleButtons={VIEW_MODE_OPTIONS.map((mode) => ({
          key: mode,
          value: mode,
          children: LABELS[mode],
        }))}
      />
    </HStack>
  </HStack>
);

export const GroupBudgetSkeleton = () => {
  const { platform } = useParams<{ platform: PlatformsValue }>();

  const tabItems = PLATFORM_TAB_CONFIG.map(({ value, label, icon: TabIcon }) => ({
    value,
    label,
    tabProps: {
      icon: <TabIcon sx={{ width: 16, height: 16 }} />,
      iconPosition: 'start' as const,
    },
  }));

  return (
    <>
      <VStack sx={{ mt: 14 }}>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{LABELS.tier1GroupBudget}</Typography>
          <HStack gap={4} alignItems="center">
            <Button variant="outlined" startIcon={<Icon name="download" />} disabled>
              {LABELS.downloadCsv}
            </Button>
            <Button variant="contained" startIcon={<Icon name="edit" />} disabled>
              {LABELS.editBudget}
            </Button>
          </HStack>
        </HStack>

        <HStack alignItems="center" sx={{ mt: 2, mb: 6 }}>
          <HStack alignItems="center" gap={1}>
            <Icon name="notifications" sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">{LABELS.alertNote}</Typography>
          </HStack>
          <Button
            variant="link"
            size="medium"
            startIcon={<Icon name="settings" />}
            disabled
            sx={{ '&.Mui-disabled': { backgroundColor: 'transparent' } }}
          >
            <Typography variant="bodyBold">{LABELS.alertSettings}</Typography>
          </Button>
        </HStack>

        <Box>
          <Tabs value={platform} tabItems={tabItems} />
        </Box>
      </VStack>

      <MonthlyViewControlSkeleton />

      <VStack gap={5}>
        <TableSkeleton columns={5} rows={5} showFooter />
        <Typography color="text.hint" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
          {LABELS.unlimitedNote}
        </Typography>
      </VStack>
    </>
  );
};
