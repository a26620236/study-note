import { Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

import { HStack, VStack } from '@lumiture-ui';
import { nFormatAbbreviation } from '@shared/utils';

import { useGetRightsizingOverview } from '@hooks-api';

import { PAPER_HEIGHT } from '../../constants/rightsizing';

const LABELS = {
  title: 'Cost Avoidance to Date',
  noData: 'No Data',
  noDate: 'Start date not set',
};

export function CostAvoidanceToDate() {
  const { data } = useSession();
  const { data: overviewResponse } = useGetRightsizingOverview();
  const overviewData = overviewResponse?.data;

  const actualAvoidanceToDate = overviewData?.actualAvoidanceToDate;

  const currency = data?.user.currency;
  const { amount, since } = actualAvoidanceToDate ?? {};

  const hasAmount = amount !== undefined;

  const dateText = since
    ? `Starting from ${format(new Date(since), 'd MMM. yyyy')}`
    : LABELS.noDate;

  return (
    <Paper sx={{ padding: '24px', height: PAPER_HEIGHT }}>
      <VStack gap={1}>
        <HStack alignItems="center" flexWrap="nowrap" gap={1}>
          <Typography variant="captionBold" color="text.secondary">
            {LABELS.title}
          </Typography>
        </HStack>
        <HStack alignItems="baseline" gap={1}>
          <Typography variant="h2" color={hasAmount ? 'text.primary' : 'text.hint'}>
            {hasAmount ? nFormatAbbreviation({ num: amount }) : LABELS.noData}
          </Typography>
          {hasAmount && <Typography variant="captionBold">{currency}</Typography>}
        </HStack>
        <HStack justifyContent="flex-end">
          <Typography variant="caption" color="text.secondary">
            {dateText}
          </Typography>
        </HStack>
      </VStack>
    </Paper>
  );
}
