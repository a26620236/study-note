import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { PlatformsValue } from '@constants';

import { UsageIntegrationHydration } from './components/UsageIntegrationHydration';
import { UsageIntegrationSkeleton } from './components/UsageIntegrationSkeleton';

function assertValidPlatform(value: string): asserts value is PlatformsValue {
  const validPlatforms: string[] = Object.values(PlatformsValue);
  if (!validPlatforms.includes(value)) notFound();
}

interface UsageIntegrationPageProps {
  params: Promise<{ platform: string }>;
}

export default async function UsageIntegrationPage({ params }: UsageIntegrationPageProps) {
  const { platform } = await params;
  assertValidPlatform(platform);

  return (
    <Suspense fallback={<UsageIntegrationSkeleton />}>
      <UsageIntegrationHydration platform={platform} />
    </Suspense>
  );
}
