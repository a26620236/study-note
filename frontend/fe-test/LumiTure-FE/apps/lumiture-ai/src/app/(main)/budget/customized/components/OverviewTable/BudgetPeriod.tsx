import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { keyBy } from 'lodash-es';

import { PERIOD_OPTIONS } from '@app/(main)/budget/customized/components/constants';
import { MonitoringPeriod } from '@app/(main)/budget/customized/components/types';
import type { CustomizedAlerts } from '@hooks-api';

const periodDateFormatMap = {
  [MonitoringPeriod.DAILY]: 'd MMM.',
  [MonitoringPeriod.MONTHLY]: 'do',
  [MonitoringPeriod.YEARLY]: 'd MMM. yyyy',
  [MonitoringPeriod.CUSTOMIZED]: 'd MMM. yyyy',
};

const BudgetPeriod = ({
  period,
  startDate,
  endDate,
}: {
  period: CustomizedAlerts['period'];
  startDate: CustomizedAlerts['startDate'];
  endDate: CustomizedAlerts['endDate'];
}) => {
  const periodLabels = keyBy(PERIOD_OPTIONS, 'value');
  const dateFormat = periodDateFormatMap[period];
  const formattedPeriod =
    period === MonitoringPeriod.CUSTOMIZED
      ? `${format(new Date(startDate), dateFormat)} - ${format(new Date(endDate), dateFormat)}`
      : `Starts on ${format(new Date(startDate), dateFormat)}`;

  return (
    <Stack>
      <Typography>{formattedPeriod}</Typography>
      <Typography variant="caption" color="text.hint">
        {periodLabels[period].label}
      </Typography>
    </Stack>
  );
};

export default BudgetPeriod;
