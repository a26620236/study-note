import { format } from 'date-fns';

export const formatFiscalMonth = (date: Date) => `${format(date, 'MMM')}. ’${format(date, 'yy')}`;
