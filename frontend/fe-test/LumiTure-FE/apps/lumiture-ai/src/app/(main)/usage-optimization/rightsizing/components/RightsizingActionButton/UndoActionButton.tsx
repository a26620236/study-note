import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { RecommendStatus, usePatchRecommendAction } from '@hooks-api';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { invalidateRecommendQuery } from '../../utils/invalidateRecommendQuery';

const LABELS = {
  buttonText: (buttonText: string) => buttonText,
  description: `The items will be transferred to "Recommendations"`,
  toastSuccess: (length: number) => `${length} recommendation items applied successfully.`,
  toastError: (length: number) =>
    `Unable to apply ${length} recommendation items. Please try again later.`,
};

interface UndoActionButtonProps {
  buttonText: string;
}

export function UndoActionButton({ buttonText }: UndoActionButtonProps) {
  const queryClient = useQueryClient();
  const { clearSelection, rowSelection } = useRightsizingStore();
  const { filteredData } = useRightsizingData();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const patchRecommendAction = usePatchRecommendAction();

  const handleDismiss = async () => {
    try {
      await patchRecommendAction.mutateAsync({
        action: RecommendStatus.Recommendations,
        items: selectedData.map((item) => item.recId),
      });
      invalidateRecommendQuery(queryClient);
      popSuccessToast({
        description: LABELS.toastSuccess(selectedData.length),
      });
      clearSelection();
    } catch (error) {
      popErrorToast({
        description: LABELS.toastError(selectedData.length),
      });
      console.error(error);
    }
  };

  return (
    <Button
      variant="outlined"
      onClick={handleDismiss}
      isLoading={patchRecommendAction.isPending}
      disabled={patchRecommendAction.isPending}
      tooltipProps={{
        title: LABELS.description,
        placement: 'top',
      }}
    >
      <HStack gap={1} alignItems="center">
        <Icon name="undo" sx={{ fontSize: 16 }} />
        {LABELS.buttonText(buttonText)}
      </HStack>
    </Button>
  );
}
