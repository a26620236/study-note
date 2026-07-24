import { subMonths } from 'date-fns';
import { create } from 'zustand';

const REFRESH_DAY = 10;

export function getMaxSelectableDate(): Date {
  const today = new Date();
  return subMonths(today, today.getDate() >= REFRESH_DAY ? 1 : 2);
}

interface ExecutiveInsightsStore {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  getFiscalReportQueryString: () => { year: string; month: string };
}

export const useExecutiveInsightsStore = create<ExecutiveInsightsStore>()((set, get) => {
  const maxSelectableDate = getMaxSelectableDate();
  return {
    selectedDate: maxSelectableDate,
    setSelectedDate: (date: Date) =>
      set((state) => ({
        ...state,
        selectedDate: date,
      })),
    getFiscalReportQueryString: () => {
      const state = get();
      return {
        year: state.selectedDate.getFullYear().toString(),
        month: (state.selectedDate.getMonth() + 1).toString(),
      };
    },
  };
});
