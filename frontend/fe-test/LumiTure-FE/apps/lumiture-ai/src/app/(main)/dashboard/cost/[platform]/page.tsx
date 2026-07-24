import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { parseUrl } from '@shared/utils';

import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';

import { CostDashboardHydration } from './components/CostDashboard/CostDashboardHydration';
import { CostDashboardSkeleton } from './components/CostDashboard/CostDashboardSkeleton';
import type { FilterValuesQueryString } from './utils/initializeFilter';

function assertValidCostDashboardPlatform(value: string): asserts value is PlatformValueWithFOCUS {
  const validPlatforms: string[] = [
    ...Object.values(PlatformsValue),
    ...Object.values(CrossCloudValue),
  ];
  if (!validPlatforms.includes(value)) notFound();
}

interface CostDashboardProps {
  params: Promise<{
    platform: string;
  }>;
  searchParams: Promise<{
    filter_values?: string;
  }>;
}

export default async function CostDashboard({ params, searchParams }: CostDashboardProps) {
  const { platform } = await params;
  assertValidCostDashboardPlatform(platform);
  const { filter_values } = await searchParams;
  const parsedFilterValues = parseUrl<FilterValuesQueryString>(filter_values);

  return (
    <Suspense fallback={<CostDashboardSkeleton />}>
      <CostDashboardHydration platform={platform} filterValues={parsedFilterValues} />
    </Suspense>
  );
}
