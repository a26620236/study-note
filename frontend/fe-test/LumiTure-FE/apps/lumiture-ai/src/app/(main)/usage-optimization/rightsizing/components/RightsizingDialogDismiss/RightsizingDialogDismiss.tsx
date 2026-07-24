import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { RecommendStatus, usePatchRecommendAction } from '@hooks-api';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { invalidateRecommendQuery } from '../../utils/invalidateRecommendQuery';
import { DISMISS_REASONS, dismissSchema, type DismissFormData } from './dismiss.constants';

export const LABELS = {
  title: 'Dismiss Recommendations',
  subtitle: 'Please choose a reason before dismissing these recommendations:',
  errorText: 'Please select a reason for dismissing these recommendations:',
  toastSuccess: (length: number) => `${length} recommendation items applied successfully.`,
  toastError: (length: number) =>
    `Unable to apply ${length} recommendation items. Please try again later.`,
};

interface RightsizingDialogDismissProps {
  open: boolean;
  onClose: () => void;
}

export function RightsizingDialogDismiss({ open, onClose }: RightsizingDialogDismissProps) {
  const queryClient = useQueryClient();
  const { clearSelection, rowSelection } = useRightsizingStore();
  const { filteredData } = useRightsizingData();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const patchRecommendAction = usePatchRecommendAction();

  const isLoading = patchRecommendAction.isPending;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<DismissFormData>({
    resolver: zodResolver(dismissSchema),
    defaultValues: {
      reason: '',
      customReason: '',
    },
    mode: 'onSubmit',
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form is not compatible with React Compiler
  const selectedReason = watch('reason');

  const onDismiss = async (reason: string) => {
    try {
      await patchRecommendAction.mutateAsync({
        action: RecommendStatus.Dismiss,
        items: selectedData.map((item) => item.recId),
        reason,
      });

      invalidateRecommendQuery(queryClient);

      popSuccessToast({
        description: LABELS.toastSuccess(selectedData.length),
      });
      clearSelection();
      handleClose();
    } catch (error) {
      popErrorToast({
        description: LABELS.toastError(selectedData.length),
      });
      console.error(error);
    }
  };

  const onSubmit = async (data: DismissFormData) => {
    const reason =
      data.reason === 'other'
        ? (data.customReason ?? '')
        : (DISMISS_REASONS.find((r) => r.value === data.reason)?.label ?? '');

    await onDismiss(reason);
  };

  const handleSkipAndDismiss = async () => {
    await onDismiss('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (!selectedReason) return;
    trigger('reason');
  }, [selectedReason, trigger]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          p: '24px 32px',
          minWidth: 800,
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={8}>
          <HStack justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{LABELS.title}</Typography>
            <Icon
              name="close"
              sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 24 }}
              onClick={handleClose}
              aria-label="Close Dialog Dismiss"
            />
          </HStack>
          <VStack gap={1}>
            <VStack>
              <Typography variant="body1">
                Dismiss duration is determined by your <strong>Scope Settings</strong>.
              </Typography>
              <Typography variant="body1" color={errors.reason ? 'error' : 'text.primary'}>
                {errors.reason ? LABELS.errorText : LABELS.subtitle}
              </Typography>
            </VStack>

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <VStack gap={1}>
                    {DISMISS_REASONS.map((reason) => (
                      <FormControlLabel
                        key={reason.value}
                        value={reason.value}
                        control={<Radio size="small" />}
                        label={
                          <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
                            {reason.label}
                          </Typography>
                        }
                      />
                    ))}
                  </VStack>
                </RadioGroup>
              )}
            />
            {selectedReason === 'other' && (
              <Controller
                name="customReason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    placeholder="Please provide a brief explanation..."
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1, pl: 6, width: '100%' }}
                    error={!!errors.customReason}
                    helperText={errors.customReason?.message}
                  />
                )}
              />
            )}
          </VStack>
          <HStack justifyContent="space-between">
            <Button variant="text" onClick={handleSkipAndDismiss} disabled={isLoading}>
              <Typography variant="linkBold" sx={{ textTransform: 'none', fontSize: 14 }}>
                {isLoading ? 'Processing...' : 'Skip and Dismiss'}
              </Typography>
            </Button>
            <HStack gap={2}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isLoading} isLoading={isLoading}>
                Dismiss Recommendations
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Dialog>
  );
}
