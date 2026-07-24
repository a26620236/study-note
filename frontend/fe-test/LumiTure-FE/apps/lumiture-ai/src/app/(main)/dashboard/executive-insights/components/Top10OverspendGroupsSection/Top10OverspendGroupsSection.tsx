import { Box, Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import EmptyState from '@components/EmptyState/EmptyState';

import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { getEndPeriod } from '../../utils/getEndPeriod';
import { Top10OverspendGroupsChartBar } from './Top10OverspendGroupsChartBar';
import { Top10OverspendGroupsTable } from './Top10OverspendGroupsTable';

const LABELS = {
  title: 'Top 10 Highest Budget Overspend Groups',
  emptyState: {
    title: 'Zero Budget Overspends!',
    desc: 'No teams have exceeded their budget! Your proactive management has kept all spending perfectly in check. This is a great achievement! Keep up the excellent work!',
  },
};

const PAPER_STYLES = {
  padding: '24px',
  borderRadius: '12px',
  width: '100%',
};

export function Top10OverspendGroupsSection() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { highestBudgetOverspend, period } = fiscalReport?.data ?? {};

  if (highestBudgetOverspend?.length === 0) {
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
              iconSymbol="celebration"
            />
          </Box>
        </VStack>
      </Paper>
    );
  }

  return (
    <Paper sx={PAPER_STYLES}>
      <Typography variant="h6" sx={{ marginBottom: '16px' }}>
        {LABELS.title}
      </Typography>

      <HStack sx={{ width: '100%', flexWrap: 'nowrap' }} gap={2}>
        <Top10OverspendGroupsTable />
        <Box sx={{ flex: 1 }}>
          <Top10OverspendGroupsChartBar />
        </Box>
      </HStack>
    </Paper>
  );
}
