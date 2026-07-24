import type { SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Tabs } from '@lumiture-ui';

import { BUDGET_PATHS } from '@constants';
import type { BudgetPlatformValue } from '@hooks-api';

import { PLATFORM_TAB_CONFIG } from '../../constants/budget';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';

interface GroupBudgetTabsProps {
  platform: BudgetPlatformValue;
}

export const GroupBudgetTabs = ({ platform }: GroupBudgetTabsProps) => {
  const router = useRouter();
  const isEditing = useBudgetSettingsStore((state) => state.isEditing);

  const handleChange = (_event: SyntheticEvent, value: BudgetPlatformValue) => {
    router.push(BUDGET_PATHS.generalBudget.pathname.replace('[platform]', value));
  };

  const tabItems = PLATFORM_TAB_CONFIG.map(({ value, label, icon: TabIcon }) => ({
    value,
    label,
    tabProps: {
      disabled: isEditing,
      icon: <TabIcon sx={{ width: 16, height: 16 }} />,
      iconPosition: 'start' as const,
    },
  }));

  return <Tabs value={platform} onChange={handleChange} tabItems={tabItems} />;
};
