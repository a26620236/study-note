import { useForm } from 'react-hook-form';

import { Segment, useGetChildGroupBudget, type BudgetPlatformValue } from '@hooks-api';

import type { ChildGroupsBudget } from '../types/budgetSettings';
import { toFormValues } from '../utils/budgetTransform';
import { useBudgetSettingsStore } from './useBudgetSettingsStore';

export const useBudgetSettingsForm = ({ platform }: { platform: BudgetPlatformValue }) => {
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);
  const { data: childGroupBudgetData } = useGetChildGroupBudget({
    platform,
    segment: Segment.MONTHLY,
    fiscalYear,
  });
  const budgetGroups = childGroupBudgetData?.data.budget ?? [];
  const periods = childGroupBudgetData?.data.period ?? [];

  return useForm<ChildGroupsBudget>({
    defaultValues: {},
    values: budgetGroups.length ? toFormValues(budgetGroups, periods) : undefined,
  });
};
