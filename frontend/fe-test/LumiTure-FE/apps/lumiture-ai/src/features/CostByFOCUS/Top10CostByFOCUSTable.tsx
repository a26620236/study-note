'use client';

import React, { useMemo } from 'react';

import { Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { theme } from '@lumiture-ui/theme';
import { nFormatAbbreviation } from '@shared/utils';

import { GroupRankTable } from '@app/(main)/dashboard/executive-insights/components/GroupRankTable';
import type { Top10CostByFOCUS } from '@hooks-api';

interface Top10CostByFOCUSTableProps {
  data: Top10CostByFOCUS[];
}

const LABELS = {
  headers: {
    rank: 'Rank',
    name: 'Service Category',
    spending: 'Spending',
    proportion: 'Share',
    changeRatio: 'Change',
  },
  getRank: (rank: string) => `Top ${rank}`,
  tooltip: {
    noDataToCompare: 'There is not enough data to compare to the previous period.',
  },
};

const getChangeColor = (change: number) => {
  if (change > 0) return theme.palette.error.main;
  if (change < 0) return theme.palette.success.main;
  return theme.palette.text.secondary;
};

export function Top10CostByFOCUSTable({ data }: Top10CostByFOCUSTableProps) {
  const columns: ColumnDef<Top10CostByFOCUS>[] = useMemo(
    () => [
      {
        accessorKey: 'ranking',
        header: () => LABELS.headers.rank,
        cell: ({ getValue }) => (
          <Typography variant="bodyBold" color="text.secondary">
            {LABELS.getRank(getValue<number>().toString().padStart(2, '0'))}
          </Typography>
        ),
        size: 56,
      },
      {
        accessorKey: 'name',
        header: () => LABELS.headers.name,
        cell: ({ getValue }) => (
          <Tooltip placement="right" title={getValue<string>()}>
            <div>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getValue<string>()}
              </Typography>
            </div>
          </Tooltip>
        ),
        size: 132,
      },
      {
        accessorKey: 'spending',
        header: () => LABELS.headers.spending,
        cell: ({ getValue }) => (
          <Typography variant="bodyBold" sx={{ color: 'colorKit.dark.2' }}>
            {nFormatAbbreviation({ num: getValue<number>() })}
          </Typography>
        ),
        size: 80,
      },
      {
        accessorKey: 'proportion',
        header: () => LABELS.headers.proportion,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          if (!value) {
            return (
              <Typography variant="bodyBold" color="text.secondary">
                --
              </Typography>
            );
          }
          const formattedValue = `${(Math.abs(value) * 100).toFixed(2)}%`;
          return (
            <Typography variant="bodyBold" sx={{ color: 'colorKit.dark.2' }}>
              {formattedValue}
            </Typography>
          );
        },
        size: 60,
      },
      {
        accessorKey: 'changeRatio',
        header: () => LABELS.headers.changeRatio,
        cell: ({ getValue }) => {
          const value = getValue<number>();
          if (!value) {
            return (
              <Tooltip title={LABELS.tooltip.noDataToCompare}>
                <Typography variant="bodyBold" color="text.secondary">
                  --
                </Typography>
              </Tooltip>
            );
          }
          const formattedValue = nFormatAbbreviation({ num: Math.abs(value) * 100, suffix: '%' });
          return (
            <Typography variant="bodyBold" sx={{ color: getChangeColor(value) }}>
              {value > 0 ? '+' : '-'}
              {formattedValue}
            </Typography>
          );
        },
        size: 80,
      },
    ],
    []
  );

  return (
    <GroupRankTable
      data={data}
      columns={columns}
      headerBackgroundColor={theme.palette.colorKit.light[2]}
    />
  );
}
