'use client';

import { useMemo, useState } from 'react';

import { Paper, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { HStack } from '@lumiture-ui';

import { CostSummaryDialog } from '@app/(main)/dashboard/components/CostSummaryDialog/CostSummaryDialog';
import { NumericDisplay } from '@components/table/NumericDisplay';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { PLATFORM_CONFIG } from '@constants';
import { useGetAnalysisHistory, type AnalysisHistoryItem } from '@hooks-api';

import { AnalysisPeriod } from '../AnalysisHistoryTableCell/AnalysisPeriod';
import { Pinned } from '../AnalysisHistoryTableCell/Pinned';

export function AlertHistoryTable() {
  const { data: analysisHistory } = useGetAnalysisHistory();
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<AnalysisHistoryItem | null>(null);

  const columns: ColumnDef<AnalysisHistoryItem>[] = useMemo(
    () => [
      {
        accessorKey: 'pin',
        header: 'Pinned',
        size: 80,
        meta: { align: 'center' },
        cell: ({ row }) => {
          const { id, pin } = row.original;
          return <Pinned id={id} isPinned={pin} />;
        },
      },
      {
        accessorKey: 'totalCost',
        header: 'Total Cost',
        size: 160,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { totalCost, filterOptions, platform } = row.original;
          const { currency } = filterOptions;
          const IconComponent = PLATFORM_CONFIG[platform].icon;
          return (
            <HStack alignItems="center" gap={2}>
              <IconComponent />
              <NumericDisplay
                value={totalCost}
                variant="currency"
                currency={currency}
                typographyProps={{ sx: { fontWeight: 400 } }}
              />
            </HStack>
          );
        },
      },

      {
        accessorKey: 'analysisPeriod',
        header: 'Analysis Period',
        size: 235,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { filterOptions } = row.original;
          const { startDate, endDate } = filterOptions;
          return <AnalysisPeriod analysisPeriod={[startDate, endDate]} />;
        },
      },
      {
        accessorKey: 'timeCreated',
        header: 'Time Created',
        size: 235,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { createdTime } = row.original;
          const formattedTimeCreated = format(new Date(createdTime), 'd MMM. yyyy HH:mm');
          return <Typography variant="body1">{formattedTimeCreated}</Typography>;
        },
      },
    ],
    []
  );

  const handleTableRowClick = (row: AnalysisHistoryItem) => {
    setIsSummaryDialogOpen(true);
    setSelectedSummary(row);
  };

  const handleCloseSummaryDialog = () => {
    setIsSummaryDialogOpen(false);
    setSelectedSummary(null);
  };

  return (
    <>
      <Paper sx={{ padding: 6, marginTop: 8 }}>
        <VirtualizedTable
          data={analysisHistory?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          onTableRowClick={handleTableRowClick}
        />
      </Paper>
      {selectedSummary && isSummaryDialogOpen && (
        <CostSummaryDialog
          summary={selectedSummary.summary}
          summaryId={selectedSummary.id}
          filterOptions={selectedSummary.filterOptions}
          createTime={selectedSummary.createdTime}
          isPinned={selectedSummary.pin}
          setIsPinned={() => setSelectedSummary({ ...selectedSummary, pin: !selectedSummary.pin })}
          open={isSummaryDialogOpen}
          onClose={handleCloseSummaryDialog}
        />
      )}
    </>
  );
}
