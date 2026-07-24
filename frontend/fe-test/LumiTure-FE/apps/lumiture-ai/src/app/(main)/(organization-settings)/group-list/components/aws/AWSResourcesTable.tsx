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
import type { AWSAssignedResourcesInfos } from '@hooks-api';

import { useAWSAssignedResourceData } from '../../hooks/useAWSAssignedResourceData';
import { usePlatformResources } from '../../hooks/usePlatformResources';
import { AWSResourceRemoveDialog } from './AWSResourceRemoveDialog/AWSResourceRemoveDialog';

interface TableCellProps {
  row: AWSAssignedResourcesInfos;
}

export function AWSResourcesTable() {
  const [isOpenRemoveResourceDialog, setIsOpenRemoveResourceDialog] = useState(false);
  const [removedResources, setRemovedResources] = useState<AWSAssignedResourcesInfos[]>([]);

  const { awsAvailableActions, awsAssignedResourceData } = useAWSAssignedResourceData();
  const { resourcesRowSelection, searchText } = usePlatformResources((state) => state.aws);
  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);

  const isEmptyAssignedResource = awsAssignedResourceData.length === 0;
  const isCanEditResource = awsAvailableActions?.removeResource ?? false;

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      const newSelection =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(resourcesRowSelection)
          : updaterOrValue;
      setResourcesRowSelection(PlatformsValue.AWS, newSelection);
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

  const selectColumn: ColumnDef<AWSAssignedResourcesInfos> = {
    id: 'select',
    header: ({ table }) => <TableSelectionHeader table={table} />,
    cell: ({ row }) => <TableSelectionCell row={row} />,
    size: 56,
    meta: { sticky: 'left' },
  };

  const baseColumns: ColumnDef<AWSAssignedResourcesInfos>[] = [
    {
      accessorKey: 'account',
      header: 'Account',
      size: 460,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => (
        <DoubleLineCell
          name={row.original.accountName}
          id={row.original.accountId}
          searchText={searchText}
        />
      ),
    },
    {
      accessorKey: 'managementAccount',
      header: 'Management Account (Account belongs to)',
      size: 460,
      meta: {
        align: 'left',
      },
      cell: ({ row }) => (
        <DoubleLineCell
          name={row.original.managementAccountName}
          id={row.original.managementAccountId}
          searchText={searchText}
        />
      ),
    },
  ];

  const columns: ColumnDef<AWSAssignedResourcesInfos>[] = isCanEditResource
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
            data={awsAssignedResourceData}
            columns={columns}
            enableRowSelection={isCanEditResource}
            rowSelection={resourcesRowSelection}
            onRowSelectionChange={handleRowSelectionChange}
            getRowId={(row) => row.accountId}
          />
        )}
      </VStack>
      <AWSResourceRemoveDialog
        removedResources={removedResources}
        open={isOpenRemoveResourceDialog}
        handleClose={() => setIsOpenRemoveResourceDialog(false)}
      />
    </>
  );
}
