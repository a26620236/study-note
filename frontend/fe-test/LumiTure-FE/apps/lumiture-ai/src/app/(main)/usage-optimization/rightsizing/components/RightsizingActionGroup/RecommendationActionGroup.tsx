import { HStack } from '@lumiture-ui';

import { useRightsizingData } from '../../hooks/useRightsizingData';
import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { getSelectedData } from '../../utils/getSelectedData';
import { ArchiveActionButton } from '../RightsizingActionButton/ArchiveActionButton';
import { DismissActionButton } from '../RightsizingActionButton/DismissActionButton';
import { DoneActionButton } from '../RightsizingActionButton/DoneActionButton';

export function RecommendationActionGroup() {
  const { filteredData } = useRightsizingData();
  const { rowSelection } = useRightsizingStore();
  const selectedData = getSelectedData(filteredData, rowSelection);
  const hasSelectedData = selectedData.length > 0;

  return (
    hasSelectedData && (
      <HStack gap={2}>
        <DoneActionButton />
        <DismissActionButton />
        <ArchiveActionButton />
      </HStack>
    )
  );
}
