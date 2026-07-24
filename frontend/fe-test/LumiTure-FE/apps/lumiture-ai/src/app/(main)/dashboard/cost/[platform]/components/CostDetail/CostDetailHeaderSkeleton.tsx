import { Typography } from '@mui/material';
import { format } from 'date-fns';

import { Button, HStack, Icon } from '@lumiture-ui';

import { Currency } from '@constants';

import { initializeDate } from '../../utils/initializeDate';

const LABELS = {
  costDetails: 'Cost Details',
  downloadCSV: 'Download CSV',
  period: (startDate: string, endDate: string) => `Period: ${startDate} ~ ${endDate}`,
};

export function CostDetailHeaderSkeleton() {
  const { startDate, endDate } = initializeDate();

  const currency = Currency.USD;

  const startDateLabel = format(new Date(startDate), 'd MMM. yyyy');
  const endDateLabel = format(new Date(endDate), 'd MMM. yyyy');

  return (
    <>
      <HStack justifyContent="space-between">
        <Typography variant="h4">{LABELS.costDetails}</Typography>
        <Button startIcon={<Icon name="download" />} variant="outlined" disabled={true}>
          {LABELS.downloadCSV}
        </Button>
      </HStack>
      <HStack justifyContent="space-between" mt={1}>
        <Typography variant="caption" color="text.hint">
          {currency}
        </Typography>
        <Typography variant="bodyMedium" color="text.hint" sx={{ fontStyle: 'italic' }}>
          {LABELS.period(startDateLabel, endDateLabel)}
        </Typography>
      </HStack>
    </>
  );
}
