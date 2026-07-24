import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { BUDGET_PATHS } from '@constants';
import type { BudgetPlatformValue } from '@hooks-api';

import { BudgetSettingsHydration } from './components/BudgetSettings/BudgetSettingsHydration';
import { BudgetSettingsSkeleton } from './components/BudgetSettings/BudgetSettingsSkeleton';
import { PLATFORMS } from './constants/budget';

interface BudgetSettingsPageProps {
  params: Promise<{
    platform: string;
  }>;
}

const VALID_PLATFORM_STRINGS = PLATFORMS.map((value): string => value);

const isValidBudgetPlatform = (platform: string): platform is BudgetPlatformValue =>
  VALID_PLATFORM_STRINGS.includes(platform);

export default async function BudgetSettingsPage({ params }: BudgetSettingsPageProps) {
  const { platform } = await params;

  if (!isValidBudgetPlatform(platform)) {
    redirect(BUDGET_PATHS.generalBudget.pathname.replace('[platform]', PLATFORMS[0]));
  }

  return (
    <Suspense fallback={<BudgetSettingsSkeleton />}>
      <BudgetSettingsHydration platform={platform} />
    </Suspense>
  );
}
