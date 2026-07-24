import { format } from 'date-fns';

const LABELS = {
  getPeriod: (period: string) => `Period: ${period}`,
};

export function getEndPeriod(endDate?: string) {
  if (!endDate) {
    return '--';
  }

  return LABELS.getPeriod(format(new Date(endDate), 'MMM. yyyy'));
}
