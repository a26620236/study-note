import type { MouseEvent } from 'react';

import { Tooltip, Typography, useTheme } from '@mui/material';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { produce } from 'immer';

import { Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { TOAST_LABELS } from '@app/(main)/dashboard/components/CostSummaryDialog/PinnedCostSummary';
import {
  analysisHistoryQueryKey,
  usePinnedAnalysisSummary,
  type AnalysisHistoryResponse,
} from '@hooks-api';

const LABELS = {
  tooltip:
    'This analysis is from over 60 days ago. Unpinning this item will remove it from your view permanently.',
};

interface PinnedProps {
  id: string;
  isPinned: boolean;
}

interface PinnedAnalysisSummaryPayload {
  id: string;
  pin: boolean;
}

const pinMutationOptions = (queryClient: QueryClient) => ({
  onMutate: async (variables: PinnedAnalysisSummaryPayload) => {
    await queryClient.cancelQueries({ queryKey: analysisHistoryQueryKey });
    const previousData = queryClient.getQueryData<AnalysisHistoryResponse>(analysisHistoryQueryKey);

    queryClient.setQueryData<AnalysisHistoryResponse>(analysisHistoryQueryKey, (old) => {
      if (!old) return old;
      return produce(old, (draft) => {
        const foundItem = draft.data.find((item) => item.id === variables.id);
        if (!foundItem) return old;
        foundItem.pin = variables.pin;
      });
    });
    return { previousData };
  },
  onSuccess: (_data: unknown, variables: PinnedAnalysisSummaryPayload) => {
    popSuccessToast({
      description: variables.pin ? TOAST_LABELS.pinSuccess : TOAST_LABELS.unpinSuccess,
    });
    queryClient.invalidateQueries({ queryKey: analysisHistoryQueryKey });
  },
  onError: (
    error: AxiosError,
    variables: PinnedAnalysisSummaryPayload,
    context?: { previousData: AnalysisHistoryResponse | undefined }
  ) => {
    console.error(error);
    if (!context?.previousData) return;
    queryClient.setQueryData(analysisHistoryQueryKey, context.previousData);
    popErrorToast({
      description: variables.pin ? TOAST_LABELS.pinError : TOAST_LABELS.unpinError,
    });
  },
});

export function Pinned({ id, isPinned }: PinnedProps) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { mutate: pinAnalysisSummary } = usePinnedAnalysisSummary(pinMutationOptions(queryClient));

  const iconColor = isPinned ? theme.palette.primary.main : theme.palette.text.secondary;

  const handlePinAnalysisSummary = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (!id) return;
    pinAnalysisSummary({ id, pin: !isPinned });
  };

  return (
    <Tooltip title={<Typography variant="body1">{LABELS.tooltip}</Typography>}>
      <Icon
        name="keep"
        sx={{ fontSize: '20px', color: iconColor, cursor: 'pointer' }}
        onClick={(event) => handlePinAnalysisSummary(event)}
        data-testid="pinned-icon"
      />
    </Tooltip>
  );
}
