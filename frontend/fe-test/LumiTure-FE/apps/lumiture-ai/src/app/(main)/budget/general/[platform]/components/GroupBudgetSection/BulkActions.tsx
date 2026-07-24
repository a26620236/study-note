import { memo, useState } from 'react';

import { Chip, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { mapValues, omit } from 'lodash-es';
import { useFormContext } from 'react-hook-form';

import { Button, DropdownButton, HStack, Icon } from '@lumiture-ui';
import { popSuccessToast } from '@shared/utils';

import { AllocateType, BudgetAction, MONTHS } from '../../constants/budget';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import type { EditingBudget, MonthBudgets } from '../../types/budgetSettings';
import { validateMaxBudget } from '../../utils/budgetCalc';
import {
  handleAllocateBudget,
  handleBalanceBudget,
  handleFillBudget,
} from '../../utils/budgetDistribute';
import { EditBudgetPanel } from '../EditBudgetPanel/EditBudgetPanel';

const handleAllocateBudgetByEqualAmount = (
  segmentPeriod: MonthBudgets,
  amount: number
): MonthBudgets => {
  const newBudget = Math.floor(amount / MONTHS);
  return mapValues(segmentPeriod, () => validateMaxBudget(newBudget));
};

const LABELS = {
  selected: (count: number) => `${count} Selected`,
  selectMultiple: 'Select multiple groups to set budgets at once.',
  clearBudget: 'Clear Budget',
  setBudgets: 'Set Budgets',
  applied: 'Successfully applied.',
};

export const BulkActions = memo(function BulkActions() {
  const rowSelection = useBudgetSettingsStore((state) => state.rowSelection);
  const setRowSelection = useBudgetSettingsStore((state) => state.setRowSelection);

  const theme = useTheme();
  const selectedGroupsCnt = Object.entries(rowSelection).filter(
    ([_id, selected]) => selected
  ).length;
  const hasSelectedGroups = selectedGroupsCnt > 0;

  const { getValues, setValue } = useFormContext();

  const [isOpenEditBudget, setIsOpenEditBudget] = useState(false);
  const handleEditOpen = () => setIsOpenEditBudget(true);
  const handleEditClose = () => setIsOpenEditBudget(false);

  const handleUnselectedAll = () => setRowSelection({});

  const handleClearBudget = () => {
    Object.entries(rowSelection).forEach(([id, isSelected]) => {
      if (!isSelected) return;

      const targetBudgets = omit(getValues()[id], ['id', 'name']);
      setValue(
        id,
        mapValues(targetBudgets, () => null)
      );
    });

    handleUnselectedAll();

    popSuccessToast({ description: LABELS.applied });
  };

  const handleEditConfirm = (data: EditingBudget) => {
    // 對每個選取的 group，以該 group 現有的 period 結構為骨架套用 mutation
    const applyToSelectedGroups = (transform: (budgets: MonthBudgets) => MonthBudgets) => {
      Object.entries(rowSelection).forEach(([id, isSelected]) => {
        if (!isSelected) return;

        const targetBudgets = omit(getValues()[id], ['id', 'name']);
        setValue(id, transform(targetBudgets));
      });
    };

    // REBALANCE 不需 amount；ALLOCATE / FILL 由表單保證 amount 非空（amount 為空時確認鈕 disabled）
    if (data.action === BudgetAction.REBALANCE) {
      // 各組內預算加總後重新平均
      applyToSelectedGroups((budgets) => handleBalanceBudget(budgets));
    } else if (data.amount !== null) {
      const { amount } = data;

      if (data.action === BudgetAction.ALLOCATE) {
        // DistributeEqually：平分給選中的組別；其餘（含 EqualAmount）：每組都擁有這筆預算
        applyToSelectedGroups((budgets) =>
          data.allocateType === AllocateType.DistributeEqually
            ? handleAllocateBudget(budgets, amount, selectedGroupsCnt)
            : handleAllocateBudgetByEqualAmount(budgets, amount)
        );
      } else {
        // BudgetAction.FILL：將所有月份填入一樣的預算
        applyToSelectedGroups((budgets) => handleFillBudget(budgets, amount));
      }
    }

    handleEditClose();
  };

  return (
    <HStack alignItems="center" sx={{ p: 4, bgcolor: 'primary.light10' }}>
      {hasSelectedGroups ? (
        <Chip
          color="primary"
          label={LABELS.selected(selectedGroupsCnt)}
          onDelete={handleUnselectedAll}
        />
      ) : (
        <Typography color="text.secondary">{LABELS.selectMultiple}</Typography>
      )}

      <Tooltip title={!hasSelectedGroups && LABELS.selectMultiple} placement="top">
        <HStack gap={4} sx={{ ml: 'auto' }}>
          <Button onClick={handleClearBudget} disabled={!hasSelectedGroups}>
            {LABELS.clearBudget}
          </Button>
          <DropdownButton
            isOpen={isOpenEditBudget}
            handleOpen={handleEditOpen}
            handleClose={handleEditClose}
            disabled={!hasSelectedGroups}
            sx={{ display: 'flex', alignItems: 'start' }}
            placement="bottom-end"
            button={
              <Button
                startIcon={<Icon name="settings" />}
                onClick={handleEditOpen}
                disabled={!hasSelectedGroups}
                sx={{
                  bgcolor: isOpenEditBudget
                    ? `${theme.palette.primary.dark} !important`
                    : 'inherit',
                }}
                endIcon={
                  <Icon
                    name="arrow_drop_down"
                    sx={{
                      transform: isOpenEditBudget ? 'rotate(-180deg)' : 'unset',
                      transition: 'transform .2s ease-in-out',
                    }}
                  />
                }
              >
                {LABELS.setBudgets}
              </Button>
            }
          >
            <EditBudgetPanel onConfirm={handleEditConfirm} selectedGroups={selectedGroupsCnt} />
          </DropdownButton>
        </HStack>
      </Tooltip>
    </HStack>
  );
});
