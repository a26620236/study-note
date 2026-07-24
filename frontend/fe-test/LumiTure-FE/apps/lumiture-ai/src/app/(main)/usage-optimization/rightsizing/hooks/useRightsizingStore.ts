import type { RowSelectionState } from '@tanstack/react-table';
import { create } from 'zustand';

import { RecommendStatus } from '@hooks-api';

interface RightsizingStore {
  // Toggle status
  selectedStatus: RecommendStatus;
  setSelectedStatus: (status: RecommendStatus) => void;

  // Table Selection
  rowSelection: RowSelectionState; // React Table 的 rowSelection 狀態 (rec_id -> boolean)
  setRowSelection: (newSelection: RowSelectionState) => void;
  clearSelection: () => void; // 清空所有選擇

  // Filtering
  selectedAssignToGroups: string[]; // 選中的 assignTo 群組
  setSelectedAssignToGroups: (groups: string[]) => void;

  selectedProviders: string[]; // 選中的 provider
  setSelectedProviders: (providers: string[]) => void;

  searchText: string; // 搜尋文字
  setSearchText: (text: string) => void;
}

export const useRightsizingStore = create<RightsizingStore>((set) => ({
  selectedStatus: RecommendStatus.Recommendations,
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  rowSelection: {},
  setRowSelection: (newSelection) => set({ rowSelection: newSelection }),
  clearSelection: () => set({ rowSelection: {} }),

  selectedAssignToGroups: [],
  setSelectedAssignToGroups: (groups) => set({ selectedAssignToGroups: groups }),

  selectedProviders: [],
  setSelectedProviders: (providers) => set({ selectedProviders: providers }),

  searchText: '',
  setSearchText: (text) => set({ searchText: text }),
}));
