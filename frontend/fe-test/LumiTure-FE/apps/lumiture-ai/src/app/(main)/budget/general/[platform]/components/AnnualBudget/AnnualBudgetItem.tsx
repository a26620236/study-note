import type { ReactNode } from 'react';

import { Tooltip, Typography, type TypographyProps } from '@mui/material';
import { isNil, isNumber } from 'lodash-es';

import { HStack, VStack } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import { Currency, type CurrencyCode } from '@constants';

import { MAXIMUM_BUDGET } from '../../constants/budget';
import type { FormBudget } from '../../types/budgetSettings';
import { ExpectedBudget } from './ExpectedBudget';

export interface AnnualBudgetItemProps {
  icon?: ReactNode;
  title: string;
  budget: number | null;
  budgetExchange: number | null;
  showBudgetExchange: boolean;
  currency: CurrencyCode | undefined;
  expectedBudget?: FormBudget;
  expectedBudgetExchange?: FormBudget;
  budgetProps?: TypographyProps;
}

const LABELS = {
  overspendTooltip: 'The budget cannot be empty and must not exceed the expected budget.',
  unsetTooltip: 'Budget not set (Unlimited)',
  approx: '≈',
  emptyDisplay: '--',
  currencyPrefix: '$',
};

export const AnnualBudgetItem = ({
  icon,
  title,
  budget,
  budgetExchange,
  showBudgetExchange,
  currency,
  expectedBudget,
  expectedBudgetExchange,
  budgetProps,
}: AnnualBudgetItemProps) => {
  const isOverspend = isNumber(expectedBudget) && isNumber(budget) && budget > expectedBudget;
  const formatBudget = (budgetValue: AnnualBudgetItemProps['budget']) => {
    if (isNil(budgetValue)) return LABELS.emptyDisplay;

    if (budgetValue >= MAXIMUM_BUDGET) {
      return `${nFormatter({ num: budgetValue / MAXIMUM_BUDGET, fixed: 2, prefix: LABELS.currencyPrefix })}M`;
    }

    return nFormatter({ num: budgetValue });
  };

  return (
    <VStack gap={2} sx={{ flex: 1 }}>
      <HStack alignItems="center" gap={1} sx={{ height: 24 }}>
        {icon}
        <Typography variant="captionBold" color="text.secondary">
          {title}
        </Typography>
      </HStack>
      <VStack alignItems="flex-start" justifyContent="center" sx={{ minHeight: 54 }}>
        <Tooltip
          title={isNil(budget) ? LABELS.unsetTooltip : (isOverspend && LABELS.overspendTooltip)}
          placement="top"
        >
          <VStack>
            <HStack alignItems="baseline" gap={1}>
              <Typography
                variant="h2"
                color={isOverspend ? 'error.main' : 'text.primary'}
                {...budgetProps}
              >
                {formatBudget(budget)}
              </Typography>
              <Typography variant="bodyBold">{Currency.USD}</Typography>
            </HStack>
            {showBudgetExchange && (
              <HStack alignItems="center" gap={1}>
                <Typography variant="h6">{LABELS.approx}</Typography>
                <Typography variant="h6">{nFormatter({ num: budgetExchange })}</Typography>
                <Typography variant="captionBold">{currency}</Typography>
              </HStack>
            )}
          </VStack>
        </Tooltip>
      </VStack>
      {isNil(expectedBudget) ? null : (
        <ExpectedBudget
          expectedBudget={expectedBudget}
          expectedBudgetExchange={expectedBudgetExchange}
          currency={currency}
          showBudgetExchange={showBudgetExchange}
        />
      )}
    </VStack>
  );
};
