import { Box, Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import EmptyState from '@components/EmptyState/EmptyState';

import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { getEndPeriod } from '../../utils/getEndPeriod';
import { Top10SpendingGroupsChartBar } from './Top10SpendingGroupsChartBar';
import { Top10SpendingGroupsTable } from './Top10SpendingGroupsTable';

const PAPER_STYLES = {
  padding: '24px',
  borderRadius: '12px',
  width: '100%',
};

const LABELS = {
  title: 'Top 10 Highest Spending Groups',
  emptyState: {
    title: 'No Spending Data Yet',
    desc: 'Your cloud accounts have not generated any spending, or resources have not yet been synced to LumiTure.ai. \nOnce you begin using your resources, your spending will be displayed here.',
  },
};

export function Top10SpendingGroupsSection() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { highestSpending = [], period } = fiscalReport?.data ?? {};

  if (highestSpending.length === 0) {
    return (
      <Paper sx={PAPER_STYLES}>
        <VStack>
          <Typography variant="h6">{LABELS.title}</Typography>
          <Typography
            variant="caption"
            color="text.hint"
            sx={{ fontStyle: 'italic', textAlign: 'end' }}
          >
            {getEndPeriod(period?.end)}
          </Typography>
          <Box sx={{ height: '320px' }}>
            <EmptyState
              size="medium"
              type="error"
              title={LABELS.emptyState.title}
              desc={LABELS.emptyState.desc}
              iconUrl="/images/empty_chart.svg"
            />
          </Box>
        </VStack>
      </Paper>
    );
  }

  return (
    <Paper sx={PAPER_STYLES}>
      <HStack sx={{ width: '100%', flexWrap: 'nowrap' }} gap={4}>
        <VStack flexWrap="nowrap" sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ marginBottom: '16px' }}>
            {LABELS.title}
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Top10SpendingGroupsChartBar />
          </Box>
        </VStack>

        <Top10SpendingGroupsTable />
      </HStack>
    </Paper>
  );
}
