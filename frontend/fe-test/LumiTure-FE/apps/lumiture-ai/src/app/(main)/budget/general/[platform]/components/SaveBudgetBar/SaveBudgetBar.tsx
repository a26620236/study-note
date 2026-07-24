import { Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { isEmpty, isNumber } from 'lodash-es';
import { useFormContext } from 'react-hook-form';

import { Button, HStack, Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import type { PlatformsValue } from '@constants';
import {
  childGroupBudgetBaseQueryKey,
  currentGroupBudgetBaseQueryKey,
  Segment,
  useGetChildGroupBudget,
  useGetCurrentGroupBudget,
  usePostChildGroupBudget,
  type ChildGroupBudgetItemPayload,
  type GroupRow,
} from '@hooks-api';

import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import type { ChildGroupsBudget, MonthBudgets } from '../../types/budgetSettings';
import { toFormValues } from '../../utils/budgetTransform';

const handleTotalBudgetGroupByPeriod = (watchAllBudgets: ChildGroupsBudget): MonthBudgets => {
  const monthlyTotals: MonthBudgets = {};
  Object.values(watchAllBudgets).forEach((group) =>
    Object.entries(group).forEach(([period, value]) => {
      if (!value) return;
      monthlyTotals[period] = Number(monthlyTotals[period] ?? 0) + Number(value);
    })
  );
  return monthlyTotals;
};

const toChildGroupsPayload = (
  formValues: ChildGroupsBudget,
  groups: GroupRow[],
  periods: string[]
): ChildGroupBudgetItemPayload[] =>
  groups.map((group) => ({
    id: group.id,
    name: group.name,
    budgets: periods.map((period) => {
      const value = formValues[group.id][period];
      return { period, value: isNumber(value) ? value : null };
    }),
  }));

interface SaveBudgetBarProps {
  platform: PlatformsValue;
}

const LABELS = {
  exceedWarning: 'The budget of all groups should not exceed the assigned budget.',
  cancel: 'Cancel',
  save: 'Save Change',
  saveSuccess: 'Budget set complete.',
  saveError: 'Budget set failed. Please try again later.',
};

export const SaveBudgetBar = ({ platform }: SaveBudgetBarProps) => {
  const queryClient = useQueryClient();
  const { reset, getValues, watch } = useFormContext<ChildGroupsBudget>();

  const isEditing = useBudgetSettingsStore((state) => state.isEditing);
  const setIsEditing = useBudgetSettingsStore((state) => state.setIsEditing);
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);

  const { data: childGroupBudgetData } = useGetChildGroupBudget({
    platform,
    segment: Segment.MONTHLY,
    fiscalYear,
  });
  const budgetGroups = childGroupBudgetData?.data.budget ?? [];
  const periods = childGroupBudgetData?.data.period ?? [];
  const hasEditBudgetAuth = childGroupBudgetData?.data.availableActions.editBudget;

  const { data: currentGroupBudgetData } = useGetCurrentGroupBudget({
    segment: Segment.MONTHLY,
    fiscalYear,
  });
  const currentPlatformAllocatedBudgets =
    currentGroupBudgetData?.data[platform].allocatedBudgets;
  const currentGroupExpectedBudget = currentGroupBudgetData?.data[platform].allocatedBudget;

  const postChildGroupBudgetMutation = usePostChildGroupBudget({
    onSuccess: () => {
      popSuccessToast({ description: LABELS.saveSuccess });
      queryClient.invalidateQueries({ queryKey: currentGroupBudgetBaseQueryKey });
      queryClient.invalidateQueries({ queryKey: childGroupBudgetBaseQueryKey });
    },
    onError: (error) => {
      popErrorToast({ description: LABELS.saveError });
      console.error(error);
    },
    onSettled: () => setIsEditing(false),
  });

  // 各群組各月份預算加總後，是否超過被分配的預算上限
  const totalBudgetByChildGroups = handleTotalBudgetGroupByPeriod(watch());
  const hasExceededBudget = Object.entries(currentPlatformAllocatedBudgets ?? {})
    .filter(([key]) => key !== 'total')
    .some(([period, value]) => +(totalBudgetByChildGroups[period] ?? 0) > (value ?? 0));
  // 只有 t1 manager（有 expected budget 上限）才會被超支擋住儲存
  const isDisabled = isNumber(currentGroupExpectedBudget) && hasExceededBudget;

  const handleCancel = () => {
    reset(toFormValues(budgetGroups, periods));
    setIsEditing(false);
  };

  const handleSave = () => {
    if (isEmpty(budgetGroups)) {
      setIsEditing(false);
      return;
    }

    const postData = toChildGroupsPayload(getValues(), budgetGroups, periods);
    // payload 後端必填具體財年；store 未選時 fallback 後端回傳的當前財年
    postChildGroupBudgetMutation.mutate({
      platform,
      fiscalYear: fiscalYear ?? currentGroupBudgetData?.data.fiscalYear,
      groups: postData,
    });
  };

  if (!isEditing || !hasEditBudgetAuth) return null;

  return (
    <FixedBottomBarWrapper>
      {/* warning */}
      {isDisabled && (
        <HStack alignItems="center" gap={1}>
          <Icon name="info" sx={{ fontSize: 20, color: 'text.hint' }} />
          <Typography color="text.secondary">{LABELS.exceedWarning}</Typography>
        </HStack>
      )}
      {/* cancel */}
      <Button variant="outlined" onClick={handleCancel} sx={{ ml: 'auto', mr: 4 }}>
        {LABELS.cancel}
      </Button>
      {/* save */}
      <Tooltip title={isDisabled && LABELS.exceedWarning}>
        <div>
          <Button onClick={handleSave} disabled={isDisabled} startIcon={<Icon name="save" />}>
            {LABELS.save}
          </Button>
        </div>
      </Tooltip>
    </FixedBottomBarWrapper>
  );
};
