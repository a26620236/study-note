import { Box, Tooltip, Typography } from '@mui/material';
import { isNumber } from 'lodash-es';
import { useSession } from 'next-auth/react';

import { HStack } from '@lumiture-ui';

import { Depth } from '@constants';
import type { PeriodData } from '@hooks-api';

import { MonthlyViewMode } from '../../constants/budget';
import { formatBudgetDisplay } from '../../utils/budgetFormat';
import { CapDotIndicator } from './CapDotIndicator';

const LABELS = {
  [MonthlyViewMode.Budget]: 'Budget not set (Unlimited)',
  [MonthlyViewMode.Spend]: 'Missing actual data',
  [MonthlyViewMode.Remaining]: 'Unable to calculate (no budget or no data)',
};

const CAP_DOT_TIER_LABEL = 'Tier 1';

interface MonthValueCellProps {
  periodData: PeriodData | undefined;
  viewMode: MonthlyViewMode;
}

export const MonthValueCell = ({ periodData, viewMode }: MonthValueCellProps) => {
  const { data: session } = useSession();
  const depth = session?.user.group?.depth;

  if (periodData === undefined) {
    return <Typography variant="bodyMedium">{formatBudgetDisplay(null)}</Typography>;
  }

  const displayValue = periodData.value;
  const isEmptyValue = !isNumber(displayValue);

  // plannedBudget !== null 才比較（spend / remaining view 固定為 null，不標紅）
  const isOverCap =
    isNumber(periodData.plannedBudget) &&
    isNumber(periodData.value) &&
    periodData.value < periodData.plannedBudget;

  // Cap Dot 僅 Budget view + Admin 身份 + isOverCap 時顯示
  // 重複 isNumber 讓 TypeScript 收窄為 number（中間 boolean 變數不傳遞 narrowing）
  const capDotData =
    isOverCap &&
    depth === Depth.ADMIN &&
    isNumber(periodData.plannedBudget) &&
    isNumber(periodData.value)
      ? { plannedBudget: periodData.plannedBudget, capValue: periodData.value }
      : null;

  const getTooltipTitle = () => {
    if (isEmptyValue) return LABELS[viewMode];
    return '';
  };

  return (
    <Tooltip title={getTooltipTitle()} placement="top">
      <HStack justifyContent="flex-end" alignItems="center">
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <Typography
            variant="bodyMedium"
            color={isNumber(displayValue) && displayValue < 0 ? 'error.main' : 'text.primary'}
          >
            {formatBudgetDisplay(displayValue ?? null)}
          </Typography>
          {capDotData !== null && (
            <Box sx={{ position: 'absolute', top: 0, right: -10 }}>
              <CapDotIndicator
                subordinateTierLabel={CAP_DOT_TIER_LABEL}
                plannedBudget={capDotData.plannedBudget}
                capValue={capDotData.capValue}
              />
            </Box>
          )}
        </Box>
      </HStack>
    </Tooltip>
  );
};
