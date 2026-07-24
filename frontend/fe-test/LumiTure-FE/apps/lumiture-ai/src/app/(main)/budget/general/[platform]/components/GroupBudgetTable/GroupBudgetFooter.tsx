import { Tooltip, Typography } from '@mui/material';
import { isNumber, sum } from 'lodash-es';
import { useFormContext } from 'react-hook-form';

import { VStack } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import { TableFooterCell } from '@components/table/TableFooterCell';
import { Depth } from '@constants';
import type { Budget } from '@hooks-api';

import type { ChildGroupsBudget, FormBudget } from '../../types/budgetSettings';
import { handleGetTotalRowBudget, isBudgetValid } from '../../utils/budgetCalc';
import { formatBudgetDisplay } from '../../utils/budgetFormat';

const LABELS = {
  total: 'Total',
  allocated: 'Allocated',
  exceedBudget: 'The budget cannot be empty and must not exceed the expected budget.',
};

const handleGetTotalColumnBudget = (columnBudgets: ChildGroupsBudget, date: Budget['period']) => {
  const budgets = Object.values(columnBudgets).map((rowData) => rowData[date]);
  return budgets.every((budget) => !isBudgetValid(budget)) ? null : sum(budgets.map(Number));
};

const getExceedColor = (depth: Depth | undefined, isExceed: boolean) => {
  if (depth !== Depth.T1) return 'text.primary';
  return isExceed ? 'error.main' : 'text.primary';
};

export const FooterTitle = ({ showExpected }: { showExpected: boolean }) => (
  <VStack sx={{ flex: 1 }}>
    <TableFooterCell>
      <Typography variant="bodyBold" color="text.primary">
        {LABELS.total}
      </Typography>
    </TableFooterCell>
    <TableFooterCell hidden={!showExpected}>
      <Typography variant="bodyBold" color="text.primary">
        {LABELS.allocated}
      </Typography>
    </TableFooterCell>
  </VStack>
);

export const FooterGrandTotal = ({
  depth,
  totalExpectedBudget,
  showExpected,
}: {
  depth: Depth | undefined;
  totalExpectedBudget: FormBudget;
  showExpected: boolean;
}) => {
  const { watch } = useFormContext<ChildGroupsBudget>();
  const total = sum(Object.values(watch()).map(handleGetTotalRowBudget));
  const isExceed = isNumber(totalExpectedBudget) && total > totalExpectedBudget;

  return (
    <VStack sx={{ flex: 1 }}>
      <TableFooterCell sx={{ color: getExceedColor(depth, isExceed) }}>
        <Typography color="inherit">{formatBudgetDisplay(total)}</Typography>
      </TableFooterCell>
      <TableFooterCell hidden={!showExpected}>
        <Typography color="text.primary">{`$${nFormatter({ num: totalExpectedBudget, fixed: 0 })}`}</Typography>
      </TableFooterCell>
    </VStack>
  );
};

export const FooterColumnTotal = ({
  depth,
  month,
  expected,
  showExpected,
}: {
  depth: Depth | undefined;
  month: Budget['period'];
  expected: FormBudget;
  showExpected: boolean;
}) => {
  const { watch } = useFormContext<ChildGroupsBudget>();
  const total = handleGetTotalColumnBudget(watch(), month);
  const isExceed = isNumber(expected) && (total ?? 0) > expected;

  return (
    <Tooltip title={isExceed ? LABELS.exceedBudget : ''} placement="top">
      <VStack sx={{ flex: 1 }}>
        <TableFooterCell sx={{ color: getExceedColor(depth, isExceed) }}>
          <Typography color="inherit">{formatBudgetDisplay(total)}</Typography>
        </TableFooterCell>
        <TableFooterCell hidden={!showExpected}>
          <Typography color="text.primary">{`$${nFormatter({ num: expected, fixed: 0 })}`}</Typography>
        </TableFooterCell>
      </VStack>
    </Tooltip>
  );
};
