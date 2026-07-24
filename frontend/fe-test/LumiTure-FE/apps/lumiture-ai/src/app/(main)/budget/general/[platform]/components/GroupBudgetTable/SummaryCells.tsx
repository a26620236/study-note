import { Tooltip, Typography } from '@mui/material';
import { isNumber } from 'lodash-es';

import { HStack } from '@lumiture-ui';

import { ProgressBar } from '@components/ProgressBar';

import { SPENT_PERCENT_THRESHOLD } from '../../constants/budget';
import { formatBudgetDisplay, formatSpentPercent } from '../../utils/budgetFormat';

export const getSpentPercentColor = (spendPercentage: number | null | undefined): string => {
  if (!isNumber(spendPercentage)) return 'text.primary';
  if (spendPercentage >= SPENT_PERCENT_THRESHOLD.ERROR) return 'error.main';
  if (spendPercentage >= SPENT_PERCENT_THRESHOLD.WARNING) return 'warning.main';
  return 'success.main';
};

const LABELS = {
  spendMissing: 'Missing actual data',
  remainingUncalculable: 'Unable to calculate (no budget or no data)',
  annualSpendExceed: 'Spend exceeds annual budget.',
};

interface SpendCellProps {
  value: number | null;
  isSpendOver: boolean;
}

export const SpendCell = ({ value, isSpendOver }: SpendCellProps) => {
  const getTooltipTitle = () => {
    if (!isNumber(value)) return LABELS.spendMissing;
    if (isSpendOver) return LABELS.annualSpendExceed;
    return '';
  };

  return (
    <Tooltip title={getTooltipTitle()} placement="top">
      <Typography variant="bodyMedium" color={isSpendOver ? 'error.main' : 'text.primary'}>
        {formatBudgetDisplay(value)}
      </Typography>
    </Tooltip>
  );
};

interface SpentPercentCellProps {
  spendPercentage: number | null;
}

// 年度消耗率：依門檻套色（0–79 綠 / 80–99 黃 / 100+ 紅）並附進度條
export const SpentPercentCell = ({ spendPercentage }: SpentPercentCellProps) => {
  const color = getSpentPercentColor(spendPercentage);

  if (!isNumber(spendPercentage)) {
    return (
      <Typography variant="bodyMedium" color={color}>
        {formatSpentPercent(spendPercentage)}
      </Typography>
    );
  }

  return (
    <HStack gap={2} alignItems="center" justifyContent="flex-start" sx={{ width: '100%' }}>
      <ProgressBar percentage={spendPercentage} getColor={getSpentPercentColor} width={40} />
      <Typography variant="bodyMedium" color={color}>
        {formatSpentPercent(spendPercentage)}
      </Typography>
    </HStack>
  );
};

interface RemainingCellProps {
  value: number | null;
  isSpendOver: boolean;
}

export const RemainingCell = ({ value, isSpendOver }: RemainingCellProps) => (
  <Tooltip title={isNumber(value) ? '' : LABELS.remainingUncalculable} placement="top">
    <Typography variant="bodyMedium" color={isSpendOver ? 'error.main' : 'text.primary'}>
      {formatBudgetDisplay(value)}
    </Typography>
  </Tooltip>
);
