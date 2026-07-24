import { IconButton, Typography } from '@mui/material';

import { HStack, Icon } from '@lumiture-ui';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export const FILTER_PANEL_LABELS = {
  title: 'Dashboard Configuration',
};

export function FilterPanelHeader() {
  const { handleDrawerToggle, isDrawerOpen } = useCostDashboardStore((state) => state);

  return (
    <HStack justifyContent="space-between" alignItems="center">
      <Typography variant="h6">{FILTER_PANEL_LABELS.title}</Typography>
      <IconButton color="secondary" size="medium" onClick={() => handleDrawerToggle(!isDrawerOpen)}>
        <Icon name="chevron_right" sx={{ color: 'text.secondary' }} />
      </IconButton>
    </HStack>
  );
}
