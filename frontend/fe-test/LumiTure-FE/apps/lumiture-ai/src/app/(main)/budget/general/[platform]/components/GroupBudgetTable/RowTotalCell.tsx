import { Tooltip, Typography } from '@mui/material';
import { isNil } from 'lodash-es';
import { useFormContext } from 'react-hook-form';

import type { ChildGroupsBudget } from '../../types/budgetSettings';
import { handleGetTotalRowBudget } from '../../utils/budgetCalc';
import { formatBudgetDisplay } from '../../utils/budgetFormat';

const LABELS = {
  unableTotal: 'Unable to calculate the total, as some monthly budgets are not set.',
};

export const RowTotalCell = ({ groupId }: { groupId: number }) => {
  const { watch } = useFormContext<ChildGroupsBudget>();
  // 如果 group 至少一格 cell 設成 unlimited，則顯示 '--'
  const total = handleGetTotalRowBudget(watch(`${groupId}`));

  return (
    <Tooltip title={isNil(total) ? LABELS.unableTotal : ''} placement="top">
      <Typography variant="bodyMedium">{formatBudgetDisplay(total)}</Typography>
    </Tooltip>
  );
};
