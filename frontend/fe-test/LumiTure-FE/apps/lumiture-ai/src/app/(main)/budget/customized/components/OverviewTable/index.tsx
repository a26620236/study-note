'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import type { ColumnDef } from '@tanstack/react-table';
import { every, keyBy } from 'lodash-es';

import { Icon } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import BudgetPeriod from '@app/(main)/budget/customized/components/OverviewTable/BudgetPeriod';
import SpendAndBudgetAmount from '@app/(main)/budget/customized/components/OverviewTable/SpendAndBudgetAmount';
import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { BUDGET_PATHS } from '@constants';
import type { CustomizedAlerts, GetCustomizedAlertsRes } from '@hooks-api';

interface OverviewTableProps {
  data: GetCustomizedAlertsRes;
  selectedIds: CustomizedAlerts['id'][];
  setSelectedIds: React.Dispatch<React.SetStateAction<CustomizedAlerts['id'][]>>;
  onChangeStatus: (id: CustomizedAlerts['id'], isChecked: boolean) => void;
  onDelete: (id: CustomizedAlerts['id']) => void;
}

const OverviewTable = ({
  data,
  selectedIds,
  setSelectedIds,
  onChangeStatus,
  onDelete,
}: OverviewTableProps) => {
  const router = useRouter();

  const dataMap = keyBy(data, 'id');
  const isSelectedAll = every(
    dataMap,
    (value) => value.id !== null && selectedIds.includes(value.id)
  );

  const isIndeterminate = !!selectedIds.length && !isSelectedAll;

  const handleToggleSelectAll = () => {
    const ids = isSelectedAll || isIndeterminate ? [] : Object.keys(dataMap).filter((id) => id);
    setSelectedIds(ids);
  };
  const handleSelectBudget = (targetId: CustomizedAlerts['id']) => () => {
    if (targetId === null) return;
    if (selectedIds.includes(targetId)) {
      setSelectedIds((prevState) => prevState.filter((id) => id !== targetId));
    } else {
      setSelectedIds((prevState) => [...prevState, targetId]);
    }
  };

  const handleChangeStatus =
    (id: CustomizedAlerts['id']) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeStatus(id, event.target.checked);
    };
  const handleDelete =
    (id: CustomizedAlerts['id']) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDelete(id);
    };

  const columns: ColumnDef<CustomizedAlerts>[] = useMemo(
    () => [
      {
        accessorKey: 'checkbox',
        header: () => (
          <Checkbox
            checked={isSelectedAll}
            indeterminate={isIndeterminate}
            onChange={handleToggleSelectAll}
          />
        ),
        enableSorting: false,
        size: 48,
        meta: { sticky: 'left', align: 'center' },
        cell: ({ row }) => {
          const { id, isOptimistic } = row.original;
          const isChecked = id !== null && selectedIds.includes(id);
          return (
            <Checkbox
              checked={isChecked}
              onChange={handleSelectBudget(id)}
              onClick={(event) => event.stopPropagation()}
              disabled={isOptimistic}
            />
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Budget Name / ID',
        size: 240,
        meta: { sticky: 'left', align: 'left' },
        cell: ({ row }) => {
          const { name, id, isOptimistic } = row.original;
          const nameIdStr = `${name}\n${id}`;
          return (
            <Stack sx={{ width: '100%' }}>
              <EllipsisTooltipCell tooltipText={nameIdStr} text={name} />
              <Typography variant="caption" color="text.secondary">
                {isOptimistic ? '--' : id}
              </Typography>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'spending',
        header: 'Spend and Budget Amount',
        minSize: 360,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { spending, budget } = row.original;
          return <SpendAndBudgetAmount spending={spending} budget={budget} />;
        },
      },
      {
        accessorKey: 'resourceAmount',
        header: 'Applies to',
        minSize: 146,
        meta: { align: 'left' },
        cell: ({ getValue }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
          const resourcesAmount = getValue() as CustomizedAlerts['resourcesAmount'];
          const resourceStr =
            typeof resourcesAmount === 'number' && resourcesAmount > 1 ? 'resources' : 'resource';
          return `${nFormatter({ num: resourcesAmount })} ${resourceStr}`;
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Budget Period',
        minSize: 240,
        meta: { align: 'left' },
        cell: ({ row }) => {
          const { period, startDate, endDate } = row.original;
          return <BudgetPeriod period={period} startDate={startDate} endDate={endDate} />;
        },
      },
      {
        accessorKey: 'thresholds',
        header: 'Trigger Alerts at',
        minSize: 200,
        meta: { align: 'left' },
        cell: ({ getValue }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
          const thresholds = getValue() as CustomizedAlerts['thresholds'];
          const thresholdsStr = thresholds
            .sort((a, b) => a - b)
            .map((num: number) => `${nFormatter({ num })}%`)
            .join(', ');
          return (
            <Stack sx={{ width: '100%' }}>
              <EllipsisTooltipCell tooltipText={thresholdsStr} text={thresholdsStr} />
            </Stack>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        size: 76,
        meta: { sticky: 'right', align: 'center' },
        cell: ({ row, getValue }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
          const status = getValue() as CustomizedAlerts['status'];
          return (
            <Switch
              checked={status}
              onChange={handleChangeStatus(row.original.id)}
              onClick={(event) => event.stopPropagation()}
              disabled={row.original.isOptimistic}
            />
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableSorting: false,
        size: 76,
        meta: { sticky: 'right', align: 'center' },
        cell: ({ row }) => (
          <IconButton onClick={handleDelete(row.original.id)} disabled={row.original.isOptimistic}>
            <Icon name="delete" />
          </IconButton>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds]
  );

  const handleTableRowClick = (original: CustomizedAlerts) => {
    const { id, isOptimistic } = original;
    if (isOptimistic) return;
    router.push(BUDGET_PATHS.budgetEditAlert.pathname.replace('[alert_id]', String(id)));
  };

  return (
    <Stack
      sx={{
        '& .tableContainer': { width: '100%' },
        '& .checkbox:first-of-type': { px: 0 },
      }}
    >
      <VirtualizedTable columns={columns} data={data} onTableRowClick={handleTableRowClick} />
    </Stack>
  );
};

export default OverviewTable;
