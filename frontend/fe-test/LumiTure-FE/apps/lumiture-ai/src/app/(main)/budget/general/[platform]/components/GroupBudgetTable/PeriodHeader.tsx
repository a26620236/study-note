import { Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import type { Budget } from '@hooks-api';

import { parseYearMonth } from '../../utils/budgetFormat';

interface PeriodHeaderProps {
  period: Budget['period'];
}

// 月份欄表頭：粗體月份 + 淡色財年末兩碼，例 `Feb. ’36`
export const PeriodHeader = ({ period }: PeriodHeaderProps) => {
  const { abbreviation, shortYear } = parseYearMonth(period);
  return (
    <HStack gap={0.5} alignItems="baseline">
      <Typography variant="bodyBold">{`${abbreviation}.`}</Typography>
      <Typography variant="caption" color="text.secondary">{`’${shortYear}`}</Typography>
    </HStack>
  );
};
