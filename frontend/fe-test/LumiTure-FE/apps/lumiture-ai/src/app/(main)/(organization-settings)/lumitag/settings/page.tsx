import { Suspense } from 'react';

import { LumiTagSettingsHydration } from './components/LumiTagSettings/LumiTagSettingsHydration';
import { LumiTagSettingsSkeleton } from './components/LumiTagSettings/LumiTagSettingsSkeleton';

interface LumiTagSettingsPageProps {
  searchParams: Promise<{
    tagId?: string;
  }>;
}

export default async function LumiTagSettingsPage({ searchParams }: LumiTagSettingsPageProps) {
  const { tagId } = await searchParams;

  return (
    <Suspense fallback={<LumiTagSettingsSkeleton />}>
      <LumiTagSettingsHydration tagId={tagId} />
    </Suspense>
  );
}
