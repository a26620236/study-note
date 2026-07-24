import { format, subMonths } from 'date-fns';
import { create } from 'zustand';

import type { SelectedData } from '@lumiture-ui';

import { Ordering, type UserActivityListPayload } from '@hooks-api';

export type UserActivityFilters = Omit<UserActivityListPayload, 'page'>;

export const getDefaultUserActivityPayload = (): UserActivityFilters => ({
  emails: [],
  domainTypes: [],
  countries: [],
  startDate: format(subMonths(new Date(), 13), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  ordering: Ordering.Descending,
  search: '',
});

interface UserActivityStore {
  selectedUsers: SelectedData;
  setSelectedUsers: (selectedUsers: SelectedData) => void;
  filters: UserActivityFilters;
  setFilters: (patch: Partial<UserActivityFilters>) => void;
  resetFilters: () => void;
}

export const useUserActivityStore = create<UserActivityStore>((set) => ({
  selectedUsers: [],
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  filters: getDefaultUserActivityPayload(),
  setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),
  resetFilters: () => set({ selectedUsers: [], filters: getDefaultUserActivityPayload() }),
}));
