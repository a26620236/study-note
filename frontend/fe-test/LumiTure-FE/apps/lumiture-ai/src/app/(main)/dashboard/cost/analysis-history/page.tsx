import { Suspense } from 'react';

import { Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import TableSkeleton from '@components/table/TableSkeleton';

import { AlertHistoryTableHydration } from './components/AnalysisHistoryTable/AnalysisHistoryTableHydration';

const LABELS = {
  title: 'Analysis History',
  button: 'Cost Dashboard',
  description:
    'Here is a list of up to 10 past AI Analysis risk alert records. Click to view the details and handling status of each analysis.\nThese records are saved for 60 days. Select up to 3 items to pin them to the top of the list.',
};

export default function AlertHistoryPage() {
  return (
    <VStack>
      <HStack justifyContent="flex-start">
        <GoBack content="Cost Dashboard" url="/dashboard/cost/gcp" />
      </HStack>
      <VStack mt={5} gap={2}>
        <Typography variant="h4">{LABELS.title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
          {LABELS.description}
        </Typography>
      </VStack>

      <Suspense
        fallback={
          <Paper sx={{ padding: 6, marginTop: 8 }}>
            <TableSkeleton rows={8} columns={7} />
          </Paper>
        }
      >
        <AlertHistoryTableHydration />
      </Suspense>
    </VStack>
  );
}
