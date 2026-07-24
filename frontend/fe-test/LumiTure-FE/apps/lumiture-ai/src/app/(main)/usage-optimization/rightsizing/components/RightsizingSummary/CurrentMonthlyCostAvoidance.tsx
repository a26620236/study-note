import { Paper, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import { HStack, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { nFormatAbbreviation } from '@shared/utils';

import { Currency } from '@constants';
import { useGetRightsizingOverview } from '@hooks-api';

import { PAPER_HEIGHT } from '../../constants/rightsizing';

const LABELS = {
  title: 'Current Monthly Cost Avoidance',
  noData: 'No Data',
  notCalculated: 'Avoidance not yet calculated',
  defaultRate: '--',
  renderAvoidanceText: (avoidanceRate: number, originalCost: number) => {
    if (avoidanceRate === 0) {
      return `Flat on original $${nFormatAbbreviation({ num: originalCost })}`;
    } else if (avoidanceRate > 0) {
      return `${(avoidanceRate * 100).toFixed(2)}% avoid on original $${nFormatAbbreviation({ num: originalCost })}`;
    } else {
      return `${Math.abs(avoidanceRate * 100).toFixed(2)}% increase on original $${nFormatAbbreviation({ num: originalCost })}`;
    }
  },
};

export function CurrentMonthlyCostAvoidance() {
  const { data: overviewResponse } = useGetRightsizingOverview();
  const overviewData = overviewResponse?.data;

  const currentMonthlyAvoidance = overviewData?.currentMonthlyAvoidance;

  const { data } = useSession();
  const currency = data?.user.currency ?? Currency.USD;

  const { amount, original: originalCost, savingRate } = currentMonthlyAvoidance ?? {};

  const hasAmount = amount !== undefined;
  const hasSavingRate = savingRate !== undefined;
  const hasOriginalCost = originalCost !== undefined;

  const getAvoidanceTextColor = (avoidanceRate: number) => {
    if (savingRate === 0) return theme.palette.text.secondary;
    else if (avoidanceRate > 0) return theme.palette.success.main;
    else return theme.palette.error.main;
  };

  return (
    <Paper sx={{ padding: '24px', height: PAPER_HEIGHT }}>
      <VStack gap={1}>
        <Typography variant="captionBold" color="text.secondary">
          {LABELS.title}
        </Typography>
        <HStack alignItems="baseline" gap={1}>
          <Typography variant="h2" color={hasAmount ? 'text.primary' : 'text.hint'}>
            {hasAmount ? nFormatAbbreviation({ num: amount }) : LABELS.noData}
          </Typography>
          {hasAmount && <Typography variant="captionBold">{currency}</Typography>}
        </HStack>
        <HStack justifyContent="flex-end">
          <Typography
            variant="caption"
            color={
              hasSavingRate && hasOriginalCost
                ? getAvoidanceTextColor(savingRate)
                : 'text.secondary'
            }
          >
            {hasSavingRate && hasOriginalCost
              ? LABELS.renderAvoidanceText(savingRate, originalCost)
              : LABELS.notCalculated}
          </Typography>
        </HStack>
      </VStack>
    </Paper>
  );
}
