'use client';

import { useCallback, useMemo, useState } from 'react';

import { Paper, Typography } from '@mui/material';
import type { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { format } from 'date-fns';

import { VStack } from '@lumiture-ui';

import { useRightsizingData } from '@app/(main)/usage-optimization/rightsizing/hooks/useRightsizingData';
import { useRightsizingStore } from '@app/(main)/usage-optimization/rightsizing/hooks/useRightsizingStore';
import EmptyState from '@components/EmptyState/EmptyState';
import { DoubleLineCell } from '@components/table/DoubleLineCell';
import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import { TableSelectionCell, TableSelectionHeader } from '@components/table/TableSelection';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import type { RecommendationItem } from '@hooks-api';

import { RightsizingDialogRecommendDetail } from '../RightsizingRecommendDetailDialog/RightsizingRecommendDetailDialog';
import { AssignedToGroup } from '../RightsizingTableCell/AssignedToGroup';
import { Avoidance } from '../RightsizingTableCell/Avoidance';
import { ChipStatus } from '../RightsizingTableCell/ChipStatus';
import { ConfigurationItem } from '../RightsizingTableCell/ConfigurationItem';
import { EndOfTracking } from '../RightsizingTableCell/EndOfTracking';
import { Impact } from '../RightsizingTableCell/Impact';
import { ResourceTag } from '../RightsizingTableCell/ResourceTag';
import { RightsizingTableFilter } from '../RightsizingTableFilter/RightsizingTableFilter';
import { RightsizingTableSkeleton } from './RightsizingTableSkeleton';

export function RightsizingTable() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecId, setSelectedRecId] = useState<RecommendationItem['recId'] | null>(null);
  // 取得 Zustand store 的狀態和方法
  const { rowSelection, setRowSelection, searchText } = useRightsizingStore();

  // 使用新的 hook 取得篩選後的資料
  const { filteredData: tableData, isLoading } = useRightsizingData();

  const handleRowClick = (row: RecommendationItem) => {
    setOpenDialog(true);
    setSelectedRecId(row.recId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecId(null);
  };

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      /*
       *處理兩種選擇狀態更新方式(原本就支援兩種方式，不判斷會出錯)：
       *  1. 基於當前狀態計算新狀態（切換、新增、移除選擇項目）
       *  2. 直接設置新狀態（清空、全選等固定操作）
       */
      const newSelection =
        typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;

      setRowSelection(newSelection);
    },
    [rowSelection, setRowSelection]
  );

  // 定義表格欄位
  const columns: ColumnDef<RecommendationItem>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => <TableSelectionHeader table={table} />,
        cell: ({ row }) => <TableSelectionCell row={row} />,
        size: 56,
        meta: { sticky: 'left' },
      },
      {
        accessorKey: 'configurationItem',
        header: 'Target Item Name / ID',
        size: 240,
        meta: { sticky: 'left', align: 'left' },
        cell: ({ row }) => <ConfigurationItem configurationItem={row.original.configurationItem} />,
      },
      {
        accessorKey: 'impact',
        header: 'Impact',
        size: 112,
        meta: { align: 'left', sticky: 'left' },
        cell: ({ row }) => <Impact impact={row.original.impact} />,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 105,
        meta: { align: 'left' },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const statusA = rowA.original.status;
          const statusB = rowB.original.status;
          return statusB - statusA;
        },
        cell: ({ row }) => <ChipStatus status={row.original.status} />,
      },
      {
        accessorKey: 'recDate',
        header: 'Rec. Date',
        size: 130,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { recDate } = row.original;
          const date = new Date(recDate);
          const formattedDate = format(date, 'dd/MM/yyyy');
          return <Typography variant="body1">{formattedDate}</Typography>;
        },
      },
      {
        accessorKey: 'estimatedAvoidance',
        header: 'Est. Avoidance',
        size: 144,
        meta: { align: 'left' },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const amountA = rowA.original.estimatedAvoidance.amount;
          const amountB = rowB.original.estimatedAvoidance.amount;
          return amountA - amountB;
        },
        cell: ({ row }) => <Avoidance avoidance={row.original.estimatedAvoidance} />,
      },
      {
        accessorKey: 'recommendation',
        header: 'Recommendation',
        size: 280,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <EllipsisTooltipCell
            text={row.original.recommendation || '--'}
            maxLines={2}
            variant="body1"
          />
        ),
      },
      {
        accessorKey: 'criteria',
        header: 'Criteria',
        size: 240,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <EllipsisTooltipCell
            text={row.original.criteria.join(' & ') || '--'}
            maxLines={2}
            variant="body1"
          />
        ),
      },
      {
        accessorKey: 'actualAvoidance',
        header: 'Act. Avoidance',
        size: 144,
        meta: { align: 'left' },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const amountA = rowA.original.actualAvoidance.amount;
          const amountB = rowB.original.actualAvoidance.amount;
          return amountA - amountB;
        },
        cell: ({ row }) => <Avoidance avoidance={row.original.actualAvoidance} />,
      },
      {
        accessorKey: 'endTrack',
        header: 'End of Tracking',
        size: 165,
        meta: { align: 'left' },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const typeA = rowA.original.endTrack.type;
          const typeB = rowB.original.endTrack.type;
          return typeA - typeB;
        },
        cell: ({ row }) => (
          <EndOfTracking endOfTracking={row.original.endTrack} recId={row.original.recId} />
        ),
      },
      {
        accessorKey: 'assignTo',
        header: 'Assigned to Group',
        size: 200,
        meta: { align: 'left' },
        cell: ({ row }) => <AssignedToGroup assignTo={row.original.assignTo} />,
      },
      {
        accessorKey: 'resource',
        header: 'Resource Name / ID',
        size: 240,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <DoubleLineCell
            name={row.original.resource.name}
            id={row.original.resource.id}
            searchText={searchText}
          />
        ),
      },
      {
        accessorKey: 'resourceTag',
        header: 'Label / Tag',
        size: 160,
        meta: { align: 'left' },
        cell: ({ row }) => <ResourceTag resourceTag={row.original.resourceTag} />,
      },
    ],
    [searchText]
  );

  if (isLoading) {
    return <RightsizingTableSkeleton />;
  }

  const isEmpty = tableData.length === 0;

  return (
    <>
      <Paper sx={{ padding: 6, width: '100%', marginTop: 4 }}>
        <VStack gap={6}>
          <RightsizingTableFilter />
          {isEmpty ? (
            <EmptyState type="emptyTable" title="No Data Available" desc={null} />
          ) : (
            <VirtualizedTable
              data={tableData}
              columns={columns}
              enableRowSelection={true}
              rowSelection={rowSelection}
              onRowSelectionChange={handleRowSelectionChange}
              getRowId={(row) => row.recId}
              onTableRowClick={handleRowClick}
            />
          )}
        </VStack>
      </Paper>
      {selectedRecId && openDialog && (
        <RightsizingDialogRecommendDetail
          recId={selectedRecId}
          open={openDialog}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
