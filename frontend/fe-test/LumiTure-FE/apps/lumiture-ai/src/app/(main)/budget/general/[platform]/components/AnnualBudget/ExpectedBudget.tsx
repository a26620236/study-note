import { memo } from 'react';

import { Tooltip, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import { Currency, type CurrencyCode } from '@constants';

import type { FormBudget } from '../../types/budgetSettings';

interface ExpectedBudgetProps {
  expectedBudget?: FormBudget;
  expectedBudgetExchange?: FormBudget;
  currency: CurrencyCode | undefined;
  showBudgetExchange: boolean;
}

const LABELS = {
  expectedTooltip: "The budget limit set by the group's supervisor or the organization's Admin.",
  expectedBudget: 'Allocated Budget',
  approx: '≈',
};

export const ExpectedBudget = memo(
  ({
    expectedBudget,
    expectedBudgetExchange,
    currency,
    showBudgetExchange,
  }: ExpectedBudgetProps) => (
    <HStack gap={2} sx={{ p: 2, bgcolor: 'primary.light10', borderRadius: '4px' }}>
      <Tooltip title={LABELS.expectedTooltip} placement="bottom-start">
        <HStack>
          <Icon name="info" sx={{ color: 'text.hint', fontSize: 16 }} />
        </HStack>
      </Tooltip>
      <VStack gap={1}>
        <HStack alignContent="center" gap={1}>
          <Typography variant="caption">{LABELS.expectedBudget}</Typography>
          <Typography variant="caption">{nFormatter({ num: expectedBudget })}</Typography>
          <Typography variant="caption">{Currency.USD}</Typography>
        </HStack>
        {showBudgetExchange && (
          <HStack alignContent="center" gap={1}>
            <Typography variant="caption">{LABELS.approx}</Typography>
            <Typography variant="caption">{nFormatter({ num: expectedBudgetExchange })}</Typography>
            <Typography variant="caption">{currency}</Typography>
          </HStack>
        )}
      </VStack>
    </HStack>
  )
);
ExpectedBudget.displayName = 'ExpectedBudget';
