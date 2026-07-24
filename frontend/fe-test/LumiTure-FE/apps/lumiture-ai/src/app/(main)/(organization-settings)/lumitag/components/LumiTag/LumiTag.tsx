'use client';

import { LumiTagActionGroup } from '../LumiTagActionGroup/LumiTagActionGroup';
import { LumiTagInfoBanner } from '../LumiTagInfoBanner/LumiTagInfoBanner';
import { LumiTagSummary } from '../LumiTagSummary/LumiTagSummary';
import { LumiTagTable } from '../LumiTagTable/LumiTagTable';
import { LumiTagTitle } from '../LumiTagTitle/LumiTagTitle';

export function LumiTag() {
  return (
    <>
      <LumiTagTitle />
      <LumiTagInfoBanner />
      <LumiTagSummary />
      <LumiTagActionGroup />
      <LumiTagTable />
    </>
  );
}
