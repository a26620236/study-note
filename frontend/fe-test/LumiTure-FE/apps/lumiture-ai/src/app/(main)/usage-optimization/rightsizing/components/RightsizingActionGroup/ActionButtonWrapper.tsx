import { RecommendStatus } from '@hooks-api';

import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { ArchiveActionGroup } from './ArchiveActionGroup';
import { DismissActionGroup } from './DismissActionGroup';
import { DoneActionGroup } from './DoneActionGroup';
import { RecommendationActionGroup } from './RecommendationActionGroup';

export function ActionButtonWrapper() {
  const { selectedStatus } = useRightsizingStore();

  const isRecommendations = selectedStatus === RecommendStatus.Recommendations;
  const isDone = selectedStatus === RecommendStatus.Done;
  const isDismiss = selectedStatus === RecommendStatus.Dismiss;
  const isArchived = selectedStatus === RecommendStatus.Archived;

  return (
    <>
      {isRecommendations && <RecommendationActionGroup />}
      {isDone && <DoneActionGroup />}
      {isDismiss && <DismissActionGroup />}
      {isArchived && <ArchiveActionGroup />}
    </>
  );
}
