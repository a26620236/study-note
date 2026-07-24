import { Typography } from '@mui/material';
import { format } from 'date-fns';

const DATE_FORMAT = 'dd MMM. yyyy';

interface AnalysisPeriodProps {
  analysisPeriod: string[];
}

export function AnalysisPeriod({ analysisPeriod }: AnalysisPeriodProps) {
  const [startDate, endDate] = analysisPeriod;
  const formattedStartDate = format(startDate, DATE_FORMAT);
  const formattedEndDate = format(endDate, DATE_FORMAT);
  const formattedAnalysisPeriod = `${formattedStartDate} - ${formattedEndDate}`;
  return <Typography variant="buttonRegular1">{formattedAnalysisPeriod}</Typography>;
}
