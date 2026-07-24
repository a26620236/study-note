import { HStack } from '@lumiture-ui';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { RemoveActionButton } from '../RightsizingActionButton/RemoveActionButton';
import { UndoActionButton } from '../RightsizingActionButton/UndoActionButton';

const LABELS = {
  undoArchive: 'Undo Archive',
};

export function ArchiveActionGroup() {
  const { filteredData } = useRightsizingData();
  const { rowSelection } = useRightsizingStore();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const hasSelectedData = selectedData.length > 0;

  return (
    hasSelectedData && (
      <HStack gap={2}>
        <UndoActionButton buttonText={LABELS.undoArchive} />
        <RemoveActionButton />
      </HStack>
    )
  );
}
