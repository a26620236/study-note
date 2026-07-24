'use client';

import React, { useMemo } from 'react';

import { Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { theme } from '@lumiture-ui/theme';
import { nFormatAbbreviation } from '@shared/utils';

import type { HighestBudgetOverspend } from '@hooks-api';

import { OVERSPEND_PERCENT_THRESHOLD } from '../../constants';
import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { GroupRankTable } from '../GroupRankTable';

export interface OverspendGroup {
  groupName: string;
  overspendPercent: number;
  spending: number;
}

const LABELS = {
  headers: {
    rank: 'Rank',
    groupName: 'Group Name',
    overspend: 'Overspend',
  },
  getRank: (rank: string) => `Top ${rank}`,
};

const getOverspendColor = (overspendPercent: number) =>
  overspendPercent > OVERSPEND_PERCENT_THRESHOLD
    ? theme.palette.error.main
    : theme.palette.warning.dark;

const formatRank = (index: number): string => {
  const rank = index + 1;
  return LABELS.getRank(rank.toString().padStart(2, '0'));
};

export function Top10OverspendGroupsTable() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const columns: ColumnDef<HighestBudgetOverspend>[] = useMemo(
    () => [
      {
        accessorKey: 'rank',
        header: () => LABELS.headers.rank,
        cell: ({ row }) => (
          <Typography variant="bodyBold" color="text.secondary">
            {formatRank(row.index)}
          </Typography>
        ),
        size: 56,
      },
      {
        accessorKey: 'groupName',
        header: () => LABELS.headers.groupName,
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
        size: 144,
      },
      {
        accessorKey: 'overspendPercent',
        header: () => LABELS.headers.overspend,
        cell: ({ getValue }) => (
          <Typography variant="bodyBold" sx={{ color: getOverspendColor(getValue<number>()) }}>
            {nFormatAbbreviation({ num: getValue<number>(), suffix: '%' })}
          </Typography>
        ),
        size: 72,
      },
    ],
    []
  );

  const { highestBudgetOverspend = [] } = fiscalReport?.data ?? {};

  return (
    <GroupRankTable
      data={highestBudgetOverspend}
      columns={columns}
      headerBackgroundColor={theme.palette.warning.bg}
    />
  );
}
