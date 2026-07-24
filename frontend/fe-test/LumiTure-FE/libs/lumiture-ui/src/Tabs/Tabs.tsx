import type { ReactNode } from 'react';

import {
  Box,
  Tabs as MuiTabs,
  Tab,
  Tooltip,
  type TabProps as MuiTabProps,
  type TabsProps as MuiTabsProps,
} from '@mui/material';

interface TabItem {
  value: string;
  label: string;
  tooltipText?: ReactNode;
  tabProps?: Omit<MuiTabProps, 'value' | 'label'>;
}

interface TabsProps extends MuiTabsProps {
  tabItems: TabItem[];
}

export function Tabs({ tabItems, ...props }: TabsProps) {
  return (
    <Box sx={{ borderBottom: 2, borderColor: 'divider', flex: 1 }}>
      <MuiTabs
        {...props}
        sx={{
          marginBottom: '-3px', // 讓 tab 的 indicator 與 tab 的 border 對齊
          minHeight: '32px',
          '& .MuiTabs-list': {
            gap: '32px',
          },
        }}
        slotProps={{
          indicator: {
            sx: {
              borderRadius: '10px',
              height: '4px',
            },
          },
        }}
      >
        {tabItems.map((tabItem) => (
          <Tab
            key={tabItem.value}
            sx={{
              '&.MuiTab-root': {
                textTransform: 'none',
                paddingBottom: '4px',
                minHeight: '32px',
                padding: 0,
                minWidth: 'unset',
              },
              '&.Mui-selected': {
                fontWeight: 700,
              },
            }}
            value={tabItem.value}
            label={
              <Tooltip title={tabItem.tooltipText}>
                <Box>{tabItem.label}</Box>
              </Tooltip>
            }
            data-testid={`tab-${tabItem.value}`}
            {...tabItem.tabProps}
          />
        ))}
      </MuiTabs>
    </Box>
  );
}
