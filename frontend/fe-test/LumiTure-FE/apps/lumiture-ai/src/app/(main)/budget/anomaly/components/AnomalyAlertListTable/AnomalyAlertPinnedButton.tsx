import type { MouseEvent } from 'react';

import { IconButton, Tooltip, useTheme } from '@mui/material';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { produce } from 'immer';

import { Icon } from '@lumiture-ui';

import {
  anomalyDetectionListQueryKey,
  usePinAnomalyDetection,
  type AnomalyDetectionListResponse,
  type PinnedAnomalyDetectionPayload,
} from '@hooks-api';

interface AnomalyAlertPinnedButtonProps {
  alertId: number;
  isPinned: boolean;
}

const LABELS = {
  tooltip:
    'This anomaly is from over 30 days ago. Unpinning this item will remove it from your view permanently.',
};

const getPinMutationOptions = (queryClient: QueryClient, alertId: number) => ({
  onMutate: async (variables: PinnedAnomalyDetectionPayload) => {
    // 1. 取消所有正在進行中的 query，避免覆蓋樂觀更新
    await queryClient.cancelQueries({ queryKey: anomalyDetectionListQueryKey() });

    // 2. 取得當前的資料快照（用於錯誤回滾）
    const previousData = queryClient.getQueryData<AnomalyDetectionListResponse>(
      anomalyDetectionListQueryKey()
    );

    // 3. 樂觀更新 cache
    queryClient.setQueryData<AnomalyDetectionListResponse>(
      anomalyDetectionListQueryKey(),
      (old) => {
        if (!old) return old;
        return produce(old, (draft) => {
          const foundItem = draft.data.find((item) => item.id === alertId);
          if (!foundItem) return;
          foundItem.pin = variables.pin;
        });
      }
    );

    // 4. 回傳 context，供 onError 使用
    return { previousData };
  },
  onError: (
    error: AxiosError,
    _variables: PinnedAnomalyDetectionPayload,
    context?: { previousData: AnomalyDetectionListResponse | undefined }
  ) => {
    // 如果 mutation 失敗，回滾到之前的狀態
    console.error(error);
    if (context?.previousData) {
      queryClient.setQueryData(anomalyDetectionListQueryKey(), context.previousData);
    }
  },
  onSettled: () => {
    // mutation 完成後（無論成功或失敗）重新 fetch 資料
    queryClient.invalidateQueries({
      queryKey: anomalyDetectionListQueryKey(),
    });
  },
});

export function AnomalyAlertPinnedButton({ alertId, isPinned }: AnomalyAlertPinnedButtonProps) {
  const theme = useTheme();

  const queryClient = useQueryClient();
  const pinMutationOptions = getPinMutationOptions(queryClient, alertId);
  const { mutate: pinAnomalyDetection, isPending } = usePinAnomalyDetection(
    alertId,
    pinMutationOptions
  );

  const iconColor = isPinned ? theme.palette.primary.main : theme.palette.text.secondary;

  const handlePinAnomalyDetection = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    pinAnomalyDetection({ pin: !isPinned });
  };

  return (
    <Tooltip title={LABELS.tooltip}>
      <IconButton
        component="button"
        color="primary"
        onClick={handlePinAnomalyDetection}
        disabled={isPending}
      >
        <Icon name="keep" sx={{ fontSize: '20px', color: iconColor }} />
      </IconButton>
    </Tooltip>
  );
}
