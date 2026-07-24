import { Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { BUDGET_PATHS } from '@constants';

import { BudgetFiscalStartMonth } from './BudgetFiscalStartMonth';
import { BudgetFiscalYearSelector } from './BudgetFiscalYearSelector';

export const BudgetSettingsHeader = () => (
  <HStack justifyContent="space-between" alignItems="center">
    <Typography variant="h3">{BUDGET_PATHS.generalBudget.name}</Typography>
    <HStack gap={4} alignItems="center">
      <BudgetFiscalStartMonth />
      <BudgetFiscalYearSelector />
    </HStack>
  </HStack>
);
