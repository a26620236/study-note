import { useMemo, type MouseEvent } from 'react';

import { Skeleton, Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button, HStack, Icon } from '@lumiture-ui';

import { ProgressBar } from '@components/ProgressBar';
import { DoubleLineCell } from '@components/table/DoubleLineCell';
import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import { CoverageStatus, type LumiTagItem } from '@hooks-api';

import { LumiTagStatusChip } from '../components/LumiTagStatusChip';
import { RECOMMENDED_KEYS } from '../constant/lumiTag';
import { useLumiTagStore } from './useLumiTagStore';

export function useLumiTagTableColumns(
  onDeleteClick: (event: MouseEvent<HTMLButtonElement>, tag: LumiTagItem) => void
): ColumnDef<LumiTagItem>[] {
  const { searchText } = useLumiTagStore();

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'LumiTag',
        size: 300,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { name, valuesCount } = row.original;
          const valuesCountText = valuesCount <= 1 ? 'value' : 'values';
          const isRecommended = RECOMMENDED_KEYS.some((key) => key === name);
          return (
            <DoubleLineCell
              name={name}
              id={`${valuesCount} ${valuesCountText} ${isRecommended ? '· FinOps Recommended' : ''}`}
              searchText={searchText}
            />
          );
        },
      },
      {
        accessorKey: 'coverage',
        header: () => (
          <Tooltip title="The percentage of total cloud cost covered by this LumiTag. A tag with 100% coverage means all resources have been assigned a value under this tag key.">
            <Typography variant="captionBold">Coverage</Typography>
          </Tooltip>
        ),
        size: 192,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const percentage = Number(Number(row.original.coverage).toFixed(0));
          const isProcessing = row.original.coverageStatus === CoverageStatus.Processing;
          return isProcessing ? (
            <Skeleton variant="rounded" width={118} height={18} />
          ) : (
            <HStack gap={2}>
              <ProgressBar percentage={percentage} />
              <Typography variant="caption">{percentage}%</Typography>
            </HStack>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 90,
        meta: { align: 'center' },
        cell: ({ row }) => <LumiTagStatusChip status={row.original.status} />,
      },
      {
        accessorKey: 'lastEditor',
        header: 'Last Editor',
        size: 180,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <EllipsisTooltipCell text={row.original.lastEditor} variant="buttonRegular1" />
        ),
      },
      {
        accessorKey: 'lastModified',
        header: 'Last Modified',
        size: 150,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <Typography variant="buttonRegular1">
            {format(new Date(row.original.lastModified), 'dd/MM/yyyy')}
          </Typography>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        size: 80,
        meta: { align: 'center' },
        cell: ({ row }) => (
          <Button
            variant="text"
            onClick={(event) => onDeleteClick(event, row.original)}
            data-testid={`lumitag-delete-${row.original.id}`}
          >
            <Icon name="delete" sx={{ fontSize: 20 }} />
          </Button>
        ),
      },
    ],
    [searchText, onDeleteClick]
  );
}
