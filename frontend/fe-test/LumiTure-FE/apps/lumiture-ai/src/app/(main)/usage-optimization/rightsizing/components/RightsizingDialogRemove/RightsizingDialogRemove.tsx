import React from 'react';

import { Box, Dialog, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { usePatchRecommendAction } from '@hooks-api';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { invalidateRecommendQuery } from '../../utils/invalidateRecommendQuery';

export const LABELS = {
  title: (count: number) => `Remove ${count} Recommendation(s)`,
  subtitle:
    'Are you sure you want to remove the selected recommendation(s)? This action is irreversible.',
  toastSuccess: (length: number) => `${length} recommendation items removed successfully.`,
  toastError: (length: number) =>
    `Unable to remove ${length} recommendation items. Please try again later.`,
};

interface RightsizingDialogRemoveProps {
  open: boolean;
  onClose: () => void;
}

export function RightsizingDialogRemove({ open, onClose }: RightsizingDialogRemoveProps) {
  const queryClient = useQueryClient();
  const { clearSelection, rowSelection } = useRightsizingStore();
  const { filteredData } = useRightsizingData();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const patchRecommendAction = usePatchRecommendAction();

  const isLoading = patchRecommendAction.isPending;

  const onRemove = async () => {
    try {
      await patchRecommendAction.mutateAsync({
        action: 'remove',
        items: selectedData.map((item) => item.recId),
      });
      invalidateRecommendQuery(queryClient);

      popSuccessToast({
        description: LABELS.toastSuccess(selectedData.length),
      });
      clearSelection();
      onClose();
    } catch (error) {
      popErrorToast({
        description: LABELS.toastError(selectedData.length),
      });
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <HStack gap={2} alignItems="center">
            <Icon
              name="info"
              sx={{
                color: 'error.main',
                fontSize: 24,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {LABELS.title(selectedData.length)}
            </Typography>
          </HStack>
          <Icon
            name="close"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              fontSize: 24,
            }}
            onClick={handleClose}
          />
        </HStack>
        {/* Content */}
        <VStack gap={3}>
          <Typography variant="body1" color="text.primary">
            {LABELS.subtitle}
          </Typography>
          <Box
            sx={{
              maxHeight: 490,
              overflowY: 'auto',
              border: '1px solid',
              borderColor: theme.palette.gray.borderLight,
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography
              component="ul"
              sx={{
                pl: 6,
              }}
            >
              {selectedData.map((item) => (
                <Typography
                  key={item.recId}
                  variant="body1"
                  component="li"
                  sx={{
                    color: 'primary.main',
                  }}
                >
                  {item.configurationItem.name}
                </Typography>
              ))}
            </Typography>
          </Box>
        </VStack>
        {/* Footer */}
        <HStack justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onRemove} disabled={isLoading} isLoading={isLoading}>
            Remove Recommendation
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}
