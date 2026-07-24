import { useParams } from 'next/navigation';

import { Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { NumericDisplay } from '@components/table/NumericDisplay';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { Currency, PlatformsValue } from '@constants';
import { useGetAnomalyDetectionDetail, type CostDetailItem } from '@hooks-api';

import type { AnomalyReportPageParams } from '../type';

const LABELS = {
  table: {
    [PlatformsValue.GCP]: {
      header: {
        time: 'Cost Time',
        service: 'Service',
        sku: 'SKU',
        cost: 'Cost',
        pricing: 'Pricing',
        location: 'Location',
        costType: 'Cost Type',
        usageAmount: 'Usage Amount',
        usageUnit: 'Unit',
      },
    },
    [PlatformsValue.AWS]: {
      header: {
        time: 'Cost Time',
        service: 'Service',
        sku: 'Usage Type',
        cost: 'Unblended Cost',
        pricing: 'Public On-Demand Cost',
        location: 'Region',
        costType: 'Purchase Option',
        usageAmount: 'Usage Amount',
        usageUnit: 'Unit',
      },
    },
    [PlatformsValue.AZURE]: {
      header: {
        time: 'Cost Time',
        service: 'Meter Category',
        sku: 'Meter',
        cost: 'All Cost in USD',
        pricing: 'PAYGPrice',
        location: 'Location',
        costType: 'Frequency',
        usageAmount: 'Quantity',
        usageUnit: 'Unit of Measure',
      },
    },
  },
};

export function TopCostResourcesTable() {
  const { alertId } = useParams<AnomalyReportPageParams>();
  const { data } = useGetAnomalyDetectionDetail({
    alertId,
  });

  const {
    platform,
    costDetails,
    totalCost: { currency },
  } = data?.data ?? {
    platform: PlatformsValue.GCP,
    costDetails: [],
    totalCost: {
      amount: '--',
      currency: Currency.USD,
    },
  };

  const columns: ColumnDef<CostDetailItem>[] = [
    {
      accessorKey: 'time',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.time}</Typography>
      ),
      cell: ({ row }) => (
        <Tooltip title={format(new Date(row.original.time), 'dd/MM/yyyy HH:mm')}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {format(new Date(row.original.time), 'dd/MM/yyyy HH:mm')}
          </Typography>
        </Tooltip>
      ),
      size: 150,
      enableResizing: true,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'service',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.service}</Typography>
      ),
      cell: ({ row }) => (
        <Tooltip title={row.original.service}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.service}
          </Typography>
        </Tooltip>
      ),
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'sku',
      header: () => <Typography variant="bodyBold">{LABELS.table[platform].header.sku}</Typography>,
      cell: ({ row }) => (
        <Tooltip title={row.original.sku}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.sku}
          </Typography>
        </Tooltip>
      ),
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'cost',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.cost}</Typography>
      ),
      cell: ({ row }) => (
        <NumericDisplay value={row.original.cost} variant="currency" currency={currency} />
      ),
      size: 144,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'pricing',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.pricing}</Typography>
      ),
      cell: ({ row }) => (
        <NumericDisplay value={row.original.pricing} variant="currency" currency={currency} />
      ),
      size: 144,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'location',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.location}</Typography>
      ),
      cell: ({ row }) => (
        <Tooltip title={row.original.location}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.location ?? '--'}
          </Typography>
        </Tooltip>
      ),
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'costType',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.costType}</Typography>
      ),
      cell: ({ row }) => (
        <Tooltip title={row.original.costType}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.costType}
          </Typography>
        </Tooltip>
      ),
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'usageAmount',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.usageAmount}</Typography>
      ),
      cell: ({ row }) => (
        <Tooltip title={row.original.usageAmount}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.usageAmount}
          </Typography>
        </Tooltip>
      ),
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'usageUnit',
      header: () => (
        <Typography variant="bodyBold">{LABELS.table[platform].header.usageUnit}</Typography>
      ),
      cell: ({ row }) => (
        <Tooltip title={row.original.usageUnit}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.usageUnit}
          </Typography>
        </Tooltip>
      ),
      size: 150,
      meta: { align: 'left' },
    },
  ];

  return <VirtualizedTable columns={columns} data={costDetails} />;
}
