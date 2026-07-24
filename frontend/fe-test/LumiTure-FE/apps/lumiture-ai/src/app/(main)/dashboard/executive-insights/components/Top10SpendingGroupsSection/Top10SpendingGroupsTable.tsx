'use client';

import React, { useMemo } from 'react';

import { Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { theme } from '@lumiture-ui/theme';
import { nFormatAbbreviation } from '@shared/utils';

import type { HighestSpending } from '@hooks-api';

import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { GroupRankTable } from '../GroupRankTable';

const LABELS = {
  headers: {
    rank: 'Rank',
    groupName: 'Group Name',
    spending: 'Spending',
  },
  getRank: (rank: string) => `Top ${rank}`,
};

const STYLES = {
  // Todo: 目前色盤裡沒有，等後續和設計確認後再將 hardcode 改成 palette 引入
  headerBackgroundColor: '#E6F6FF',
};

const formatRank = (index: number): string => {
  const rank = index + 1;
  return LABELS.getRank(rank.toString().padStart(2, '0'));
};

export function Top10SpendingGroupsTable() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const columns: ColumnDef<HighestSpending>[] = useMemo(
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
        accessorKey: 'spending',
        header: () => LABELS.headers.spending,
        cell: ({ getValue }) => (
          <Typography variant="bodyBold" sx={{ color: theme.palette.colorKit.dark[2] }}>
            {nFormatAbbreviation({ num: getValue<number>() })}
          </Typography>
        ),
        size: 72,
      },
    ],
    []
  );

  const { highestSpending = [] } = fiscalReport?.data ?? {};

  return (
    <GroupRankTable
      data={highestSpending}
      columns={columns}
      headerBackgroundColor={STYLES.headerBackgroundColor}
    />
  );
}
