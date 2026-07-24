import { format, subMonths } from 'date-fns';
import { create } from 'zustand';

import type { SelectedData } from '@lumiture-ui';

import { Ordering, type LoginActivityListPayload } from '@hooks-api';

export type LoginActivityFilters = Omit<LoginActivityListPayload, 'page'>;

export const getDefaultLoginActivityPayload = (): LoginActivityFilters => ({
  emails: [],
  providers: [],
  countries: [],
  startDate: format(subMonths(new Date(), 13), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  ordering: Ordering.Descending,
  search: '',
});

interface LoginActivityStore {
  selectedUsers: SelectedData;
  setSelectedUsers: (selectedUsers: SelectedData) => void;
  filters: LoginActivityFilters;
  setFilters: (patch: Partial<LoginActivityFilters>) => void;
  resetFilters: () => void;
}

export const useLoginActivityStore = create<LoginActivityStore>((set) => ({
  selectedUsers: [],
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  filters: getDefaultLoginActivityPayload(),
  setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),
  resetFilters: () => set({ selectedUsers: [], filters: getDefaultLoginActivityPayload() }),
}));
