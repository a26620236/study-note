import { RightsizingToggleButtonSkeleton } from '../RightsizingActionGroup/RightsizingToggleButtonSkeleton';
import { RightsizingInfoBannerSkeleton } from '../RightsizingInfoBanner/RightsizingInfoBannerSkeleton';
import { RightsizingListHeaderSkeleton } from '../RightsizingListHeader/RightsizingListHeaderSkeleton';
import { RightsizingSummarySkeleton } from '../RightsizingSummary/RightsizingSummarySkeleton';
import { RightsizingTitleSkeleton } from '../RightsizingTitle/RightsizingTitleSkeleton';

export function RightsizingSkeleton() {
  return (
    <>
      <RightsizingTitleSkeleton />
      <RightsizingInfoBannerSkeleton />
      <RightsizingSummarySkeleton />
      <RightsizingListHeaderSkeleton />
      <RightsizingToggleButtonSkeleton />
    </>
  );
}
