'use client';

import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EmptyState from '@components/EmptyState/EmptyState';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { ORG_SETTINGS_PATHS } from '@constants';
import { CoverageStatus, LumiTagStatus, useGetLumiTagList, type LumiTagItem } from '@hooks-api';

import { useLumiTagStore } from '../../hooks/useLumiTagStore';
import { useLumiTagTableColumns } from '../../hooks/useLumiTagTableColumns';
import { LumiTagRemoveDialog } from './LumiTagRemoveDialog';
import { LumiTagTableSkeleton } from './LumiTagTableSkeleton';

const INITIAL_DIALOG_STATE: RemoveDialogState = {
  open: false,
  tagId: -1,
  tagName: '',
};

const POLL_INTERVAL_MS = 30000;

interface RemoveDialogState {
  open: boolean;
  tagId: number;
  tagName: string;
}

export function LumiTagTable() {
  const router = useRouter();
  const { palette } = useTheme();
  const [poll, setPoll] = useState(false);
  const { data: lumiTagResponse, isLoading } = useGetLumiTagList({
    refetchInterval: poll ? POLL_INTERVAL_MS : false,
    refetchOnWindowFocus: 'always',
  });
  const { selectedStatus, searchText } = useLumiTagStore();

  const [removeDialog, setRemoveDialog] = useState<RemoveDialogState>(INITIAL_DIALOG_STATE);

  const tags = useMemo(() => lumiTagResponse?.data.tags ?? [], [lumiTagResponse]);

  const filteredTags = useMemo(() => {
    const matchesStatus = (tag: LumiTagItem) => {
      if (selectedStatus === LumiTagStatus.All) return true;
      if (selectedStatus === LumiTagStatus.Active) return tag.status === LumiTagStatus.Active;
      return tag.status === LumiTagStatus.Inactive;
    };

    const matchesSearch = (tag: LumiTagItem) =>
      !searchText || tag.name.toLowerCase().includes(searchText.toLowerCase());

    return tags.filter((tag) => matchesStatus(tag) && matchesSearch(tag));
  }, [tags, selectedStatus, searchText]);

  const isEmpty = filteredTags.length === 0;

  const handleRowClick = (tag: LumiTagItem) => {
    router.push(`${ORG_SETTINGS_PATHS.lumiTagSettings.pathname}?tagId=${tag.id}`);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>, tag: LumiTagItem) => {
    event.stopPropagation();
    setRemoveDialog({ open: true, tagId: tag.id, tagName: tag.name });
  };

  const handleDialogClose = () => {
    setRemoveDialog(INITIAL_DIALOG_STATE);
  };

  const columns = useLumiTagTableColumns(handleDeleteClick);

  useEffect(() => {
    setPoll(tags.some((tag) => tag.coverageStatus === CoverageStatus.Processing));
  }, [tags]);

  if (isLoading) {
    return <LumiTagTableSkeleton />;
  }

  return (
    <>
      <Paper sx={{ padding: 6, width: '100%', marginTop: 4 }}>
        {isEmpty ? (
          <EmptyState type="emptyTable" title="No Data Available" desc={null} />
        ) : (
          <VirtualizedTable
            data={filteredTags}
            columns={columns}
            getRowId={(row) => row.id.toString()}
            onTableRowClick={handleRowClick}
            bodyRowSx={(row) =>
              row.original.status === LumiTagStatus.Inactive
                ? { backgroundColor: palette.gray.disableLight }
                : {}
            }
          />
        )}
      </Paper>
      {removeDialog.open && (
        <LumiTagRemoveDialog
          open={removeDialog.open}
          onClose={handleDialogClose}
          tagId={removeDialog.tagId}
          tagName={removeDialog.tagName}
        />
      )}
    </>
  );
}
