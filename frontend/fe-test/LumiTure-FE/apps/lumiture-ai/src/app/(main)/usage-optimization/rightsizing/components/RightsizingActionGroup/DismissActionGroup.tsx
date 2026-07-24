import { HStack } from '@lumiture-ui';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { ArchiveActionButton } from '../RightsizingActionButton/ArchiveActionButton';
import { UndoActionButton } from '../RightsizingActionButton/UndoActionButton';

const LABELS = {
  undoDismiss: 'Undo Dismiss',
};

export function DismissActionGroup() {
  const { filteredData } = useRightsizingData();
  const { rowSelection } = useRightsizingStore();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const hasSelectedData = selectedData.length > 0;

  return (
    hasSelectedData && (
      <HStack gap={2}>
        <UndoActionButton buttonText={LABELS.undoDismiss} />
        <ArchiveActionButton />
      </HStack>
    )
  );
}
