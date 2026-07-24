import { Tabs } from '@lumiture-ui';

interface TabsSkeletonProps {
  tabValue: string;
}

export function TabsSkeleton({ tabValue }: TabsSkeletonProps) {
  const tabItems = [
    {
      value: 'group-members',
      label: `Group Members (0)`,
    },
    {
      value: 'resources',
      label: `Resources (0)`,
    },
  ];
  return <Tabs value={tabValue} tabItems={tabItems} />;
}
