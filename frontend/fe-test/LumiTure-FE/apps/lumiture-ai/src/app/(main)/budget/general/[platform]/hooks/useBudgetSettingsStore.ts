import type { Dispatch, SetStateAction } from 'react';

import type { RowSelectionState } from '@tanstack/react-table';
import { create } from 'zustand';

import { MonthlyViewMode } from '../constants/budget';

interface BudgetSettingsStore {
  isEditing: boolean;
  rowSelection: RowSelectionState;
  fiscalYear?: number;
  viewMode: MonthlyViewMode;
  setIsEditing: (isEditing: boolean) => void;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  setFiscalYear: (fiscalYear: number) => void;
  setViewMode: (viewMode: MonthlyViewMode) => void;
  reset: () => void;
}

// reset 只清編輯狀態與已選群組；fiscalYear / viewMode 為跨平台切換要保留的設定，不在此清除
const EDITING_INITIAL_STATE: Pick<BudgetSettingsStore, 'isEditing' | 'rowSelection'> = {
  isEditing: false,
  rowSelection: {},
};

export const useBudgetSettingsStore = create<BudgetSettingsStore>((set) => ({
  ...EDITING_INITIAL_STATE,
  fiscalYear: undefined,
  viewMode: MonthlyViewMode.Budget,
  setIsEditing: (isEditing) =>
    set((state) => ({
      isEditing,
      // 離開編輯模式時一併清空已選取的 group；進入編輯時鎖回 Budget 視角（編輯只能編 budget）
      rowSelection: isEditing ? state.rowSelection : {},
      viewMode: isEditing ? MonthlyViewMode.Budget : state.viewMode,
    })),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection: typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
  setFiscalYear: (fiscalYear) => set({ fiscalYear }),
  setViewMode: (viewMode) => set({ viewMode }),
  reset: () => set(EDITING_INITIAL_STATE),
}));
