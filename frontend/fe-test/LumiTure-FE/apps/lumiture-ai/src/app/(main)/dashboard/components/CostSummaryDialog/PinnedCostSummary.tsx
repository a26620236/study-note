import { Tooltip, Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { analysisHistoryQueryKey, usePinnedAnalysisSummary } from '@hooks-api';

export const TOAST_LABELS = {
  pinSuccess: 'Analysis pinned successfully.',
  pinError: 'Unable to pin analysis. Please try again later.',
  unpinSuccess: 'Analysis unpinned successfully.',
  unpinError: 'Unable to unpin analysis. Please try again later.',
};

const LABELS = {
  tooltip:
    'You can pin a maximum of 3 items. Pinning a fourth item will automatically replace the oldest one.',
};

interface PinnedCostSummaryProps {
  id?: string;
  isPinned: boolean;
  setIsPinned?: () => void;
}

export const PinnedCostSummary = ({ id, isPinned, setIsPinned }: PinnedCostSummaryProps) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { mutate: pinAnalysisSummary } = usePinnedAnalysisSummary();

  const iconColor = isPinned ? theme.palette.primary.main : theme.palette.text.secondary;

  const handlePinAnalysisSummary = () => {
    if (!id) return;
    // 樂觀更新 UI
    setIsPinned?.();
    pinAnalysisSummary(
      { id, pin: !isPinned },
      {
        onSuccess: () => {
          popSuccessToast({
            description: isPinned ? TOAST_LABELS.unpinSuccess : TOAST_LABELS.pinSuccess,
          });
          queryClient.invalidateQueries({ queryKey: analysisHistoryQueryKey });
        },
        onError: () => {
          setIsPinned?.();
          popErrorToast({
            description: isPinned ? TOAST_LABELS.unpinError : TOAST_LABELS.pinError,
          });
        },
      }
    );
  };

  return (
    <Tooltip title={<Typography variant="body1">{LABELS.tooltip}</Typography>}>
      <Icon
        name="keep"
        sx={{ fontSize: '18px', color: iconColor, cursor: 'pointer' }}
        onClick={handlePinAnalysisSummary}
        data-testid="pin-summary-icon"
      />
    </Tooltip>
  );
};
