'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { nFormatter } from '@shared/utils';

import EmptyState from '@components/EmptyState/EmptyState';
import { DoubleLineCell } from '@components/table/DoubleLineCell';
import { SingleLineCell } from '@components/table/SingleLineCell';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import type { PlatformsValue } from '@constants';
import { PreviewDetailType, type LumiTagPreviewDetailBreakdownItem } from '@hooks-api';

import { TOGGLE_LABEL_MAP } from '../../constants/lumiTagPreviewResourceDialog';

interface LumiTagResourceDialogTableProps {
  breakdownData: LumiTagPreviewDetailBreakdownItem[];
  searchText: string;
  selectedPlatform: PlatformsValue;
  selectedToggleType: PreviewDetailType;
}

export function LumiTagResourceDialogTable({
  breakdownData,
  searchText,
  selectedPlatform,
  selectedToggleType,
}: LumiTagResourceDialogTableProps) {
  const columns = useMemo<ColumnDef<LumiTagPreviewDetailBreakdownItem>[]>(() => {
    const firstColumnLabel = TOGGLE_LABEL_MAP[selectedPlatform][selectedToggleType];
    const isSelectResource = selectedToggleType === PreviewDetailType.Resource;
    const isSelectBillingAccount = selectedToggleType === PreviewDetailType.BillingAccount;
    const isSelectProject = selectedToggleType === PreviewDetailType.Project;

    const baseColumns: ColumnDef<LumiTagPreviewDetailBreakdownItem>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        header: firstColumnLabel,
        size: isSelectResource ? 300 : 520,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { name, id } = row.original;
          return (
            <DoubleLineCell
              name={name}
              id={isSelectBillingAccount || isSelectProject ? id : ''}
              searchText={searchText}
            />
          );
        },
      },
      {
        id: 'matchedSpend',
        accessorKey: 'matchedCost',
        header: '30-Day Matched Spend',
        size: 220,
        cell: ({ row }) => {
          const { matchedCost, totalCost } = row.original;
          return (
            <Typography variant="body1">
              {nFormatter({ num: matchedCost, fixed: 2, prefix: 'USD ' })}
              <Typography variant="body1" color="text.hint" component="span">
                / {nFormatter({ num: totalCost, fixed: 2, prefix: 'USD ' })}
              </Typography>
            </Typography>
          );
        },
      },
      {
        id: 'coverage',
        accessorKey: 'percentage',
        header: 'Coverage',
        size: 90,
        cell: ({ row }) => (
          <Typography variant="body2">{`${(row.original.percentage * 100).toFixed(1)}%`}</Typography>
        ),
      },
    ];

    if (!isSelectResource) return baseColumns;

    const resourceColumns: ColumnDef<LumiTagPreviewDetailBreakdownItem>[] = [
      {
        id: 'resourceType',
        accessorKey: 'resourceType',
        header: 'Resource Type',
        size: 160,
        meta: { align: 'left' },
        cell: ({ row }) => <SingleLineCell text={row.original.resourceType ?? '--'} />,
      },
      {
        id: 'service',
        accessorKey: 'service',
        header: 'Service',
        size: 160,
        meta: { align: 'left' },
        cell: ({ row }) => <SingleLineCell text={row.original.service ?? '--'} />,
      },
    ];

    return [baseColumns[0], ...resourceColumns, ...baseColumns.slice(1)];
  }, [selectedPlatform, selectedToggleType, searchText]);

  const data = useMemo(
    () =>
      searchText === ''
        ? breakdownData
        : breakdownData.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
          ),
    [breakdownData, searchText]
  );

  if (data.length === 0) return <EmptyState type="emptyTable" />;

  return <VirtualizedTable data={data} columns={columns} />;
}
