import { Typography } from '@mui/material';

import { nFormatter } from '@shared/utils';

interface CostCellProps {
  amount: number;
}

/**
 * Reusable cell component for displaying formatted cost amounts
 */
export function CostCell({ amount }: CostCellProps) {
  return <Typography variant="body1">${nFormatter({ num: amount, fixed: 2 })}</Typography>;
}
