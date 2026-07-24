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
import type { AzureAssignedResourcesInfos } from '@hooks-api';

import { useAzureAssignedResourceData } from '../../hooks/useAzureAssignedResourceData';
import { usePlatformResources } from '../../hooks/usePlatformResources';
import { AzureResourceRemoveDialog } from './AzureResourceRemoveDialog/AzureResourceRemoveDialog';

interface TableCellProps {
  row: AzureAssignedResourcesInfos;
}

export function AzureResourcesTable() {
  const [isOpenRemoveResourceDialog, setIsOpenRemoveResourceDialog] = useState(false);
  const [removedResources, setRemovedResources] = useState<AzureAssignedResourcesInfos[]>([]);

  const { azureAvailableActions, azureAssignedResourceData } = useAzureAssignedResourceData();
  const { resourcesRowSelection, searchText } = usePlatformResources((state) => state.azure);
  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);

  const isEmptyAssignedResource = azureAssignedResourceData.length === 0;
  const isCanEditResource = azureAvailableActions?.removeResource ?? false;

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      const newSelection =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(resourcesRowSelection)
          : updaterOrValue;
      setResourcesRowSelection(PlatformsValue.AZURE, newSelection);
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

  const selectColumn: ColumnDef<AzureAssignedResourcesInfos> = {
    id: 'select',
    header: ({ table }) => <TableSelectionHeader table={table} />,
    cell: ({ row }) => <TableSelectionCell row={row} />,
    size: 56,
    meta: { sticky: 'left' },
  };

  const baseColumns: ColumnDef<AzureAssignedResourcesInfos>[] = [
    {
      accessorKey: 'resourceGroup',
      header: 'Resource Group',
      size: 460,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => (
        <DoubleLineCell
          name={row.original.resourceGroupName}
          id={row.original.resourceGroupId}
          searchText={searchText}
        />
      ),
    },
    {
      accessorKey: 'subscription',
      header: 'Subscription (Resource Group belongs to)',
      size: 460,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => (
        <DoubleLineCell
          name={row.original.subscriptionName}
          id={row.original.subscriptionId}
          searchText={searchText}
        />
      ),
    },
  ];

  const columns: ColumnDef<AzureAssignedResourcesInfos>[] = isCanEditResource
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
            data={azureAssignedResourceData}
            columns={columns}
            enableRowSelection={isCanEditResource}
            rowSelection={resourcesRowSelection}
            onRowSelectionChange={handleRowSelectionChange}
            getRowId={(row) => row.resourceGroupId}
          />
        )}
      </VStack>
      <AzureResourceRemoveDialog
        removedResources={removedResources}
        open={isOpenRemoveResourceDialog}
        handleClose={() => setIsOpenRemoveResourceDialog(false)}
      />
    </>
  );
}
