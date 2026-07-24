import { useSession } from 'next-auth/react';

import { Button, Icon } from '@lumiture-ui';

import { Depth } from '@constants';
import { BudgetCrossCloudValue, type BudgetPlatformValue, Segment, useGetChildGroupBudget } from '@hooks-api';

import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';

interface EditBudgetButtonProps {
  platform: BudgetPlatformValue;
}

const LABELS = {
  editBudget: 'Edit Budget',
};

export const EditBudgetButton = ({ platform }: EditBudgetButtonProps) => {
  const { data: session } = useSession();
  const depth = session?.user.group?.depth;
  const isEditing = useBudgetSettingsStore((state) => state.isEditing);
  const setIsEditing = useBudgetSettingsStore((state) => state.setIsEditing);
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);

  const { data: childGroupBudgetData, isSuccess } = useGetChildGroupBudget({
    platform,
    segment: Segment.MONTHLY,
    fiscalYear,
  });
  const hasEditBudgetAuth = childGroupBudgetData?.data.availableActions.editBudget;
  const isShowChildGroups = depth === Depth.ADMIN || depth === Depth.T1;
  const isEmptyChildGroups =
    isShowChildGroups && isSuccess && childGroupBudgetData.data.budget.length === 0;

  // Total 為跨雲加總、不可編輯；編輯中或無權限時亦不顯示
  if (platform === BudgetCrossCloudValue.Total || isEditing || !hasEditBudgetAuth) return null;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Button
      startIcon={<Icon name="edit" />}
      onClick={handleEditClick}
      disabled={isEmptyChildGroups}
    >
      {LABELS.editBudget}
    </Button>
  );
};
