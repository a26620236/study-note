import { useState } from 'react';

import { FiscalStartMonthSettingDialog } from '@features';
import { Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { Button, Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { Depth } from '@constants';
import {
  childGroupBudgetBaseQueryKey,
  currentGroupBudgetBaseQueryKey,
  Segment,
  useGetCurrentGroupBudget,
  usePatchFiscalStartMonth,
} from '@hooks-api';

import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';

const LABELS = {
  editStartMonth: 'Edit Start Month',
  featureName: 'Executive Insights',
  success: 'Fiscal Start Month updated successfully.',
  error: 'Unable to update Fiscal Start Month. Please try again later.',
};

// fiscalYearOptions[].startMonth 為 'YYYY-MM'，取月份部分（1-12）
const parseStartMonth = (startMonth: string | undefined): number | undefined => {
  if (!startMonth) return undefined;
  const [, month] = startMonth.split('-');
  return Number(month);
};

export function BudgetFiscalStartMonth() {
  const { data: session } = useSession();
  const depth = session?.user.group?.depth;
  const queryClient = useQueryClient();
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);
  const isEditing = useBudgetSettingsStore((state) => state.isEditing);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: patchFiscalStartMonth, isPending } = usePatchFiscalStartMonth({
    onSuccess: () => {
      // 起始月改變會重新劃分財年 → current_group 與 child_groups 全財年資料需重抓；general_alerts 與財年無關不動
      queryClient.invalidateQueries({ queryKey: currentGroupBudgetBaseQueryKey });
      queryClient.invalidateQueries({ queryKey: childGroupBudgetBaseQueryKey });
      popSuccessToast({ description: LABELS.success });
    },
    onError: (error) => {
      popErrorToast({ description: LABELS.error });
      console.error(error);
    },
    onSettled: () => setIsDialogOpen(false),
  });
  const { data } = useGetCurrentGroupBudget({ segment: Segment.MONTHLY, fiscalYear });

  // fiscal start month 為組織層級設定、各財年相同，取任一財年的 startMonth 月份即可
  const currentFiscalStartMonth = parseStartMonth(data?.data.fiscalYearOptions[0]?.startMonth);

  const handleSubmit = (selectedMonth: number) => {
    patchFiscalStartMonth({ month: selectedMonth });
  };

  if (depth !== Depth.ADMIN) return null;

  return (
    <>
      <Button
        variant="link"
        size="small"
        startIcon={<Icon name="settings" />}
        onClick={() => setIsDialogOpen(true)}
        disabled={isEditing}
      >
        <Typography variant="bodyBold">{LABELS.editStartMonth}</Typography>
      </Button>
      {isDialogOpen && (
        <FiscalStartMonthSettingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          currentFiscalStartMonth={currentFiscalStartMonth}
          featureName={LABELS.featureName}
        />
      )}
    </>
  );
}
