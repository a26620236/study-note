import type { ReactNode } from 'react';

import { Box, Divider, FormControlLabel, Paper, Skeleton, Typography } from '@mui/material';

import { Button, HStack, Icon, Markdown, Switch, VStack } from '@lumiture-ui';
import { Lumiture as LumitureIcon } from '@lumiture-ui/SvgIcon';

import { PLATFORM_CONFIG, type PlatformsValue } from '@constants';
import { BudgetCrossCloudValue } from '@hooks-api';

import { PLATFORMS } from '../../constants/budget';
import { GroupBudgetSkeleton } from './GroupBudgetSkeleton';

const ANNUAL_BUDGET_ITEM_WIDTH = '230px';

const LABELS = {
  title: 'General Budget',
  editStartMonth: 'Edit Start Month',
  organizationAnnualBudget: 'Organization Annual Budget',
  creditsNote:
    'All budgets on this page are based on actual spend, with the **EXCLUSION OF CREDITS**.',
  currentAnnualBudget: 'Current Annual Budget',
  annualBudgetTitle: (prefix: string) => `${prefix} Annual Budget`,
  displayConvertedAmount: 'Display converted amounts in other currency',
  totalInputNote:
    '*Please note that this total only presents values that have been entered, and does not include values with no input.',
};

const HeaderSkeleton = () => (
  <HStack justifyContent="space-between" alignItems="center">
    <Typography variant="h3">{LABELS.title}</Typography>
    <HStack gap={1} alignItems="center">
      <Button
        variant="link"
        size="small"
        startIcon={<Icon name="settings" />}
        disabled
        sx={{ '&.Mui-disabled': { backgroundColor: 'transparent' } }}
      >
        <Typography variant="bodyBold">{LABELS.editStartMonth}</Typography>
      </Button>

      <HStack
        alignItems="center"
        gap={2}
        sx={{
          width: 240,
          px: '8px',
          py: '6px',
          border: '1px solid',
          borderColor: 'gray.selected',
          borderRadius: '8px',
          bgcolor: 'gray.disableLight',
        }}
      >
        <HStack justifyContent="space-between" width="100%">
          <Icon name="event" sx={{ color: 'text.disabled' }} />
          <Icon name="arrow_drop_down" sx={{ color: 'text.disabled' }} />
        </HStack>
      </HStack>
    </HStack>
  </HStack>
);

interface AnnualBudgetItemSkeletonProps {
  icon?: ReactNode;
  title: string;
}

const AnnualBudgetItemSkeleton = ({ icon, title }: AnnualBudgetItemSkeletonProps) => (
  <VStack gap={2} sx={{ width: ANNUAL_BUDGET_ITEM_WIDTH }} flex={1}>
    <HStack alignItems="center" gap={1}>
      {icon}
      <Typography variant="captionBold" color="text.secondary">
        {title}
      </Typography>
    </HStack>
    <Skeleton width={200} height={54} />
  </VStack>
);

const AnnualBudgetSkeleton = () => (
  <VStack gap={6}>
    <VStack gap={2}>
      <Typography variant="h4">{LABELS.organizationAnnualBudget}</Typography>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        <Markdown>{LABELS.creditsNote}</Markdown>
      </Box>
    </VStack>

    <HStack gap={6} flexWrap="nowrap" width="100%">
      <AnnualBudgetItemSkeleton icon={<LumitureIcon />} title={LABELS.currentAnnualBudget} />
      <Divider orientation="vertical" flexItem />
      {PLATFORMS.filter(
        (platform): platform is PlatformsValue => platform !== BudgetCrossCloudValue.Total
      ).map((platform) => {
        const { icon: PlatformIcon, label } = PLATFORM_CONFIG[platform];

        return (
          <AnnualBudgetItemSkeleton
            key={platform}
            icon={<PlatformIcon />}
            title={LABELS.annualBudgetTitle(label)}
          />
        );
      })}
    </HStack>

    <FormControlLabel
      disabled
      control={<Switch checked={false} label="" />}
      label={LABELS.displayConvertedAmount}
      sx={{ mr: 0 }}
    />

    <Typography variant="caption" color="text.hint" sx={{ fontStyle: 'italic' }}>
      {LABELS.totalInputNote}
    </Typography>
  </VStack>
);

export const BudgetSettingsSkeleton = () => (
  <VStack gap={8} sx={{ mb: 8 }}>
    <HeaderSkeleton />

    <Paper>
      <VStack>
        <AnnualBudgetSkeleton />
        <GroupBudgetSkeleton />
      </VStack>
    </Paper>
  </VStack>
);
