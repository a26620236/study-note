import { format, subDays } from 'date-fns';

export const initializeDate = () => {
  const endDate = subDays(new Date(), 1);
  const startDate = subDays(new Date(), 30);

  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };
};
