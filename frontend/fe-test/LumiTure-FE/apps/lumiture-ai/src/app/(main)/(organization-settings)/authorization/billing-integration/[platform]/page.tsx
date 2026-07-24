import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { PlatformsValue } from '@constants';

import { BillingIntegrationHydration } from './components/BillingIntegrationHydration';
import { BillingIntegrationSkeleton } from './components/BillingIntegrationSkeleton';

function assertValidPlatform(value: string): asserts value is PlatformsValue {
  const validPlatforms: string[] = Object.values(PlatformsValue);
  if (!validPlatforms.includes(value)) notFound();
}

interface BillingIntegrationPageProps {
  params: Promise<{ platform: string }>;
}

export default async function BillingIntegrationPage({ params }: BillingIntegrationPageProps) {
  const { platform } = await params;
  assertValidPlatform(platform);

  return (
    <Suspense fallback={<BillingIntegrationSkeleton />}>
      <BillingIntegrationHydration platform={platform} />
    </Suspense>
  );
}
