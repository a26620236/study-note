'use client';

import { useEffect } from 'react';

import { Paper } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { useRouteProtection } from '@hooks';
import { BudgetCrossCloudValue, type BudgetPlatformValue } from '@hooks-api';

import { useBudgetSettingsForm } from '../../hooks/useBudgetSettingsForm';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import { AnnualBudget } from '../AnnualBudget/AnnualBudget';
import { BudgetSettingsHeader } from '../BudgetSettingsHeader/BudgetSettingsHeader';
import { GroupBudgetSection } from '../GroupBudgetSection/GroupBudgetSection';
import { SaveBudgetBar } from '../SaveBudgetBar/SaveBudgetBar';

interface BudgetSettingsProps {
  platform: BudgetPlatformValue;
}

export const BudgetSettings = ({ platform }: BudgetSettingsProps) => {
  const formMethods = useBudgetSettingsForm({ platform });

  const isEditing = useBudgetSettingsStore((state) => state.isEditing);
  const setIsEditing = useBudgetSettingsStore((state) => state.setIsEditing);
  const resetBudgetSettingsStore = useBudgetSettingsStore((state) => state.reset);

  useRouteProtection({ isBlock: isEditing, onCloseCallback: () => setIsEditing(false) });

  // 離開頁面時重置編輯狀態與選取（store 為全域 singleton）
  useEffect(() => () => resetBudgetSettingsStore(), [resetBudgetSettingsStore]);

  return (
    <>
      <BudgetSettingsHeader />
      <FormProvider {...formMethods}>
        <Paper
          sx={{
            mt: 8,
            mb: 8,
            border: '1px solid',
            borderColor: isEditing ? 'primary.light' : 'transparent',
          }}
        >
          <AnnualBudget />
          <GroupBudgetSection platform={platform} />
        </Paper>
        {platform !== BudgetCrossCloudValue.Total && <SaveBudgetBar platform={platform} />}
      </FormProvider>
    </>
  );
};
