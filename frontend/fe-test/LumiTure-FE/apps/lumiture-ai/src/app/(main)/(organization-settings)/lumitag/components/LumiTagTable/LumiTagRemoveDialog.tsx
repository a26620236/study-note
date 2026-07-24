'use client';

import { Dialog, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { getLumiTagListQueryKey, useDeleteLumiTag } from '@hooks-api';

const LABELS = {
  title: 'Remove LumiTag',
  renderDescription: (tagName: string) =>
    `Are you sure you want to remove **${tagName}**? This tag will be deleted from all cost reports and dashboards. This action cannot be undone.`,
  cancelButton: 'Cancel',
  removeButton: 'Remove',
  renderToastSuccess: (tagName: string) => `LumiTag "${tagName}" removed successfully.`,
  toastError: 'Unable to remove tag. Please try again later.',
};

interface LumiTagRemoveDialogProps {
  open: boolean;
  onClose: () => void;
  tagId: number;
  tagName: string;
}

export function LumiTagRemoveDialog({ open, onClose, tagId, tagName }: LumiTagRemoveDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteLumiTag, isPending } = useDeleteLumiTag({
    onSuccess: () => {
      popSuccessToast({ description: LABELS.renderToastSuccess(tagName) });
      queryClient.invalidateQueries({ queryKey: getLumiTagListQueryKey() });
      onClose();
    },
    onError: () => {
      popErrorToast({ description: LABELS.toastError });
    },
  });

  const handleRemove = () => deleteLumiTag(tagId);

  return (
    <Dialog
      open={open}
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          p: '24px 32px',
          width: 675,
          margin: 0,
        },
      }}
    >
      <VStack gap={7.5}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack gap={2} alignItems="center">
            <Icon name="info" sx={{ color: 'error.main', fontSize: 24 }} />
            <Typography variant="h4">{LABELS.title}</Typography>
          </HStack>
          <Icon name="close" onClick={onClose} sx={{ cursor: 'pointer' }} />
        </HStack>
        <Typography>
          <Markdown>{LABELS.renderDescription(tagName)}</Markdown>
        </Typography>
        <HStack gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose} disabled={isPending}>
            {LABELS.cancelButton}
          </Button>
          <Button onClick={handleRemove} disabled={isPending} isLoading={isPending}>
            {LABELS.removeButton}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}
