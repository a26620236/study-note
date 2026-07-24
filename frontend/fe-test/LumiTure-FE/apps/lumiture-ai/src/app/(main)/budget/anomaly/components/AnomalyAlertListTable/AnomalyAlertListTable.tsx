import { useRouter } from 'next/navigation';

import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { HStack, Icon } from '@lumiture-ui';

import { DoubleLineCell } from '@components/table/DoubleLineCell';
import LimitedList from '@components/table/LimitedList';
import { NumericDisplay } from '@components/table/NumericDisplay';
import TableHeader from '@components/table/TableHeader';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { BUDGET_PATHS, PLATFORM_CONFIG } from '@constants';
import type { AnomalyDetectionItem } from '@hooks-api';

import { AnomalyAlertPinnedButton } from './AnomalyAlertPinnedButton';

interface AnomalyAlertListTableProps {
  data: AnomalyDetectionItem[];
  enableExpanding: boolean;
}

const LABELS = {
  table: {
    header: {
      resourceName: 'Resource Name / ID',
      actualCost: 'Actual Cost',
      anomalyDate: 'Anomaly Date',
      groups: 'Assigned to',
      action: 'Action',
    },
    tooltip: {
      header: {
        groups: `Displays the list of your subgroups.  When '--' is displayed, it indicates that the resource is assigned to your group but has not been assigned to a lower-level group.`,
      },
      notAllowAccess:
        'The resource is assigned to your group but has not been assigned to a lower-level group.',
      getGroupListOverMaxDisplay: (extraCount: number) =>
        `...+${extraCount} more, view full list in detail page.`,
      detail: 'Check Anomaly Details',
    },
    empty: '--',
  },
} as const;

export function AnomalyAlertListTable({ data, enableExpanding }: AnomalyAlertListTableProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleNavigateToAlertDetail = (
    e: React.MouseEvent<HTMLButtonElement>,
    rowOriginal: AnomalyDetectionItem
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(BUDGET_PATHS.anomalyDetail.pathname.replace('[alertId]', String(rowOriginal.id)));
  };

  const columns: ColumnDef<AnomalyDetectionItem>[] = [
    {
      accessorKey: 'resourceName',
      header: () => <Typography variant="bodyBold">{LABELS.table.header.resourceName}</Typography>,
      cell: ({ row }) => {
        const { platform, resourceName, resourceId } = row.original;
        const canExpand = row.getCanExpand();

        return (
          <HStack
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            sx={{
              width: '100%',
            }}
            onClick={(e: React.MouseEvent) => {
              if (canExpand) {
                e.stopPropagation();
                row.getToggleExpandedHandler()();
              }
            }}
          >
            <HStack gap={1} flexWrap="nowrap" alignItems="center">
              {canExpand ? (
                <Icon
                  name={row.getIsExpanded() ? 'arrow_drop_down' : 'arrow_right'}
                  sx={{ fontSize: '24px', flexShrink: 0, color: theme.palette.text.secondary }}
                />
              ) : (
                <Box sx={{ width: '24px', flexShrink: 0 }} />
              )}
              <DoubleLineCell
                name={resourceName}
                id={resourceId}
                icon={PLATFORM_CONFIG[platform].icon({ sx: { fontSize: 20, flexShrink: 0 } })}
              />
            </HStack>
            {canExpand && (
              <Box
                sx={{
                  backgroundColor: theme.palette.gray.borderDark,
                  borderRadius: '5px',
                  px: 1.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="buttonBold1" color={theme.palette.common.white}>
                  {Number(row.original.children?.length) + 1}
                </Typography>
              </Box>
            )}
          </HStack>
        );
      },
      size: 400,
      meta: { align: 'left', sticky: 'left' },
    },
    {
      accessorKey: 'cost',
      header: () => <Typography variant="bodyBold">{LABELS.table.header.actualCost}</Typography>,
      cell: ({ row }) => {
        const { currency, cost } = row.original;
        return <NumericDisplay value={cost} variant="currency" currency={currency} />;
      },
      size: 150,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'date',
      header: () => <Typography variant="bodyBold">{LABELS.table.header.anomalyDate}</Typography>,
      cell: ({ row }) => (
        <Typography variant="body1">
          {format(new Date(row.original.date), 'd MMM. yyyy')}
        </Typography>
      ),
      size: 150,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'groups',
      header: () => (
        <TableHeader
          label={LABELS.table.header.groups}
          tooltip={LABELS.table.tooltip.header.groups}
        />
      ),
      cell: ({ row }) => {
        const { groups } = row.original;

        if (groups.length === 0) {
          return (
            <Tooltip title={LABELS.table.tooltip.notAllowAccess}>
              <Typography variant="body1">{LABELS.table.empty}</Typography>
            </Tooltip>
          );
        }

        return (
          <Tooltip title={<LimitedList items={groups} />}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                maxWidth: '100%',
                flex: 1,
                display: 'inline',
              }}
            >
              {groups.join(', ')}
            </Typography>
          </Tooltip>
        );
      },
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'action',
      header: () => <Typography variant="bodyBold">{LABELS.table.header.action}</Typography>,
      cell: ({ row }) => (
        <HStack gap={2} flexWrap="nowrap">
          <AnomalyAlertPinnedButton alertId={row.original.id} isPinned={row.original.pin} />
          <Tooltip title={LABELS.table.tooltip.detail}>
            <IconButton
              component="button"
              color="primary"
              onClick={(e) => handleNavigateToAlertDetail(e, row.original)}
            >
              <Icon
                name="description"
                sx={{ fontSize: '20px', color: theme.palette.text.secondary }}
              />
            </IconButton>
          </Tooltip>
        </HStack>
      ),
      size: 80,
      meta: { align: 'left', sticky: 'right' },
    },
  ];

  return (
    <VirtualizedTable
      data={data}
      columns={columns}
      enableExpanding={enableExpanding}
      getSubRows={(row) => row.children}
      getRowCanExpand={(row) => !!row.original.children && row.original.children.length > 0}
    />
  );
}
