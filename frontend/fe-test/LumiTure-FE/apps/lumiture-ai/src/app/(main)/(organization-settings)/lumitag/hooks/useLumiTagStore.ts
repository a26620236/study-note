import { create } from 'zustand';

import { LumiTagStatus } from '@hooks-api';

interface LumiTagStore {
  selectedStatus: LumiTagStatus;
  setSelectedStatus: (status: LumiTagStatus) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

export const useLumiTagStore = create<LumiTagStore>((set) => ({
  selectedStatus: LumiTagStatus.All,
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  searchText: '',
  setSearchText: (text) => set({ searchText: text }),
}));
