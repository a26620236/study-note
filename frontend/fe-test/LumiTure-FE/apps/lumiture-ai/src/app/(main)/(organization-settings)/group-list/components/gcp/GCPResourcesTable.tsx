import { useCallback, useState } from 'react';

import LinkOffIcon from '@mui/icons-material/LinkOff';
import type { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';

import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import { DoubleLineCell } from '@components/table/DoubleLineCell';
import { TableSelectionCell, TableSelectionHeader } from '@components/table/TableSelection';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { PlatformsValue } from '@constants';
import type { GCPAssignedResourcesInfos } from '@hooks-api';

import { useGCPAssignedResourceData } from '../../hooks/useGCPAssignedResourceData';
import { usePlatformResources } from '../../hooks/usePlatformResources';
import { GCPResourceRemoveDialog } from './GCPResourceRemoveDialog/GCPResourceRemoveDialog';

interface TableCellProps {
  row: GCPAssignedResourcesInfos;
}

export function GCPResourcesTable() {
  const [isOpenRemoveResourceDialog, setIsOpenRemoveResourceDialog] = useState(false);
  const [removedResources, setRemovedResources] = useState<GCPAssignedResourcesInfos[]>([]);

  const { gcpAvailableActions, gcpAssignedResourceData } = useGCPAssignedResourceData();
  const searchText = usePlatformResources((state) => state.gcp.searchText);
  const resourcesRowSelection = usePlatformResources((state) => state.gcp.resourcesRowSelection);
  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);

  const isEmptyAssignedResource = gcpAssignedResourceData.length === 0;
  const isCanEditResource = gcpAvailableActions?.removeResource ?? false;

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      const newSelection =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(resourcesRowSelection)
          : updaterOrValue;
      setResourcesRowSelection(PlatformsValue.GCP, newSelection);
    },
    [resourcesRowSelection, setResourcesRowSelection]
  );

  const ActionButtons = ({ row }: TableCellProps) => {
    const isDisabled = !row.canRemoveResource;

    return (
      <LinkOffIcon
        color={isDisabled ? 'disabled' : 'primary'}
        sx={{
          width: 35,
          height: 35,
          padding: '5px',
          cursor: isDisabled ? 'default' : 'pointer',
        }}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpenRemoveResourceDialog(true);
          setRemovedResources([row]);
        }}
      />
    );
  };

  const selectColumn: ColumnDef<GCPAssignedResourcesInfos> = {
    id: 'select',
    header: ({ table }) => <TableSelectionHeader table={table} />,
    cell: ({ row }) => <TableSelectionCell row={row} />,
    size: 56,
    meta: { sticky: 'left' },
  };

  const baseColumns: ColumnDef<GCPAssignedResourcesInfos>[] = [
    {
      accessorKey: 'project',
      header: 'Project',
      size: 460,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => (
        <DoubleLineCell
          name={row.original.projectName}
          id={row.original.projectId}
          searchText={searchText}
        />
      ),
    },
    {
      accessorKey: 'billingAccount',
      header: 'Billing Account (Project belongs to)',
      size: 460,
      meta: { align: 'left' },
      cell: ({ row }) => (
        <DoubleLineCell
          name={row.original.billingAccountName}
          id={row.original.billingAccountId}
          searchText={searchText}
        />
      ),
    },
  ];

  const columns: ColumnDef<GCPAssignedResourcesInfos>[] = isCanEditResource
    ? [
        selectColumn,
        ...baseColumns,
        {
          accessorKey: 'action',
          header: 'Action',
          size: 80,
          meta: {
            align: 'center',
          },
          cell: ({ row }) => <ActionButtons row={row.original} />,
        },
      ]
    : baseColumns;

  return (
    <>
      <VStack gap={4}>
        {isEmptyAssignedResource ? (
          <EmptyState size="large" type="error" {...CUSTOMIZED_EMPTY_CONTENT.emptyResource} />
        ) : (
          <VirtualizedTable
            data={gcpAssignedResourceData}
            columns={columns}
            enableRowSelection={isCanEditResource}
            rowSelection={resourcesRowSelection}
            onRowSelectionChange={handleRowSelectionChange}
            getRowId={(row) => row.projectId}
          />
        )}
      </VStack>
      <GCPResourceRemoveDialog
        removedResources={removedResources}
        open={isOpenRemoveResourceDialog}
        handleClose={() => setIsOpenRemoveResourceDialog(false)}
      />
    </>
  );
}
