import { LumiTagActionGroupSkeleton } from '../LumiTagActionGroup/LumiTagActionGroupSkeleton';
import { LumiTagInfoBanner } from '../LumiTagInfoBanner/LumiTagInfoBanner';
import { LumiTagSummarySkeleton } from '../LumiTagSummary/LumiTagSummarySkeleton';
import { LumiTagTitleSkeleton } from '../LumiTagTitle/LumiTagTitleSkeleton';

export function LumiTagSkeleton() {
  return (
    <>
      <LumiTagTitleSkeleton />
      <LumiTagInfoBanner />
      <LumiTagSummarySkeleton />
      <LumiTagActionGroupSkeleton />
    </>
  );
}
