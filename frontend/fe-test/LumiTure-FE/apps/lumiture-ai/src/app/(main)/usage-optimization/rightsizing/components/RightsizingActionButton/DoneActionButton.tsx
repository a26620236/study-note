import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { RecommendStatus, usePatchRecommendAction } from '@hooks-api';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { invalidateRecommendQuery } from '../../utils/invalidateRecommendQuery';

const LABELS = {
  buttonText: 'Done',
  description: 'The items will be transferred to "Done"',
  toastSuccess: (length: number) => `${length} recommendation items applied successfully.`,
  toastError: (length: number) =>
    `Unable to apply ${length} recommendation items. Please try again later.`,
};

export function DoneActionButton() {
  const queryClient = useQueryClient();
  const { clearSelection, rowSelection } = useRightsizingStore();
  const { filteredData } = useRightsizingData();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const patchRecommendAction = usePatchRecommendAction();

  const handleDone = async () => {
    try {
      await patchRecommendAction.mutateAsync({
        action: RecommendStatus.Done,
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
      onClick={handleDone}
      isLoading={patchRecommendAction.isPending}
      disabled={patchRecommendAction.isPending}
      tooltipProps={{
        title: LABELS.description,
        placement: 'top',
      }}
    >
      <HStack gap={1} alignItems="center">
        <Icon name="check_circle" sx={{ fontSize: 16 }} />
        {LABELS.buttonText}
      </HStack>
    </Button>
  );
}
