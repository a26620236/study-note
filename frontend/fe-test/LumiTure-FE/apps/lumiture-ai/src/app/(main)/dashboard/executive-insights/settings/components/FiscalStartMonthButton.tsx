'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { FiscalStartMonthSettingDialog } from '@features';
import { Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { getMonth } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { UnsavedChangesDialog } from '@components/dialog';
import { useGetFiscalMetricsSettings, usePatchFiscalStartMonth } from '@hooks-api';

const LABELS = {
  setFiscalStartMonth: 'Edit Start Month',
  generalBudget: 'General Budget',
  success: 'Fiscal Start Month updated successfully.',
  error: 'Unable to update Fiscal Start Month. Please try again later.',
  confirmTitle: 'Change Fiscal Year Start Month?',
  confirmDescription:
    'We recommend saving your current draft before making this change. If you proceed and select "Discard Changes", any unsaved progress will be permanently lost.',
};

export function FiscalStartMonthButton() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const fiscalYearParam = searchParams.get('year');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    formState: { isDirty: isFormDirty },
  } = useFormContext();

  const { mutate: patchFiscalStartMonth, isPending } = usePatchFiscalStartMonth({
    onSuccess: () => {
      // invalidate all fiscal metrics related cache
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'fiscal-metrics'] });
      popSuccessToast({ description: LABELS.success });
    },
    onError: (error) => {
      popErrorToast({ description: LABELS.error });
      console.error(error);
    },
    onSettled: () => setIsDialogOpen(false),
  });
  const { data } = useGetFiscalMetricsSettings(fiscalYearParam);
  const { period } = data?.data ?? {};

  const currentFiscalStartMonth = period?.start ? getMonth(new Date(period.start)) + 1 : undefined;

  const handleEditClick = () => {
    if (isFormDirty) {
      setIsConfirmOpen(true);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmDiscard = () => {
    setIsConfirmOpen(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = (selectedMonth: number) => {
    patchFiscalStartMonth({ month: selectedMonth });
  };

  return (
    <>
      <Button
        variant="link"
        size="small"
        startIcon={<Icon name="settings" />}
        onClick={handleEditClick}
      >
        <Typography variant="bodyBold">{LABELS.setFiscalStartMonth}</Typography>
      </Button>

      {isDialogOpen && (
        <FiscalStartMonthSettingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          currentFiscalStartMonth={currentFiscalStartMonth}
          featureName={LABELS.generalBudget}
        />
      )}

      {isConfirmOpen && (
        <UnsavedChangesDialog
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDiscard}
          title={LABELS.confirmTitle}
          description={LABELS.confirmDescription}
        />
      )}
    </>
  );
}
