'use client';

import { Box, Divider, Drawer, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';

import { DRAWER_WIDTH, MAIN_HEADER_HEIGHT } from '@constants';

import { CREDITS_LABELS } from '../FilterPanel/CreditsFilter';
import { FILTER_SECTION_LABELS } from '../FilterPanel/FilterSection';
import { FILTER_PANEL_BUTTON_LABELS } from '../FilterPanelButton/FilterPanelButton';
import { FilterPanelButtonWrapper } from '../FilterPanelButton/FilterPanelButtonWrapper';
import { FILTER_PANEL_LABELS } from '../FilterPanelHeader/FilterPanelHeader';

export function FilterPanelDrawerSkeleton() {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: 0,
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          marginTop: `${MAIN_HEADER_HEIGHT}px`,
        },
      }}
      variant="persistent"
      anchor="right"
      open={true}
    >
      <VStack gap={4} px={4} py={8}>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{FILTER_PANEL_LABELS.title}</Typography>
          <IconButton color="secondary" size="medium" disabled>
            <Icon name="chevron_right" sx={{ color: 'text.secondary' }} />
          </IconButton>
        </HStack>
        <SelectSkeleton />
        <SelectSkeleton />
        <Divider />
        <HStack gap={1} alignItems="center">
          <Typography variant="h6">{FILTER_SECTION_LABELS.title}</Typography>
          <Tooltip title={<Markdown>{FILTER_SECTION_LABELS.tooltip}</Markdown>}>
            <Icon name="info" sx={{ color: 'text.hint', fontSize: 16 }} />
          </Tooltip>
        </HStack>
        <SelectSkeleton />
        <SelectSkeleton />
        <SelectSkeleton />
        <SelectSkeleton />
        <SelectSkeleton />
        <SelectSkeleton />
        <Divider />
        <SelectSkeleton />
        <Typography variant="caption" color="text.secondary">
          {CREDITS_LABELS.creditsTooltip}
        </Typography>
      </VStack>
      <FilterPanelButtonWrapper>
        <Button variant="outlined" disabled>
          {FILTER_PANEL_BUTTON_LABELS.resetButton}
        </Button>
      </FilterPanelButtonWrapper>
    </Drawer>
  );
}

export function SelectSkeleton() {
  return (
    <VStack gap={1}>
      <Box py="3px">
        <Skeleton variant="rounded" width="33%" height={12} />
      </Box>
      <Box py="6px">
        <Skeleton variant="rounded" width="100%" height={24} />
      </Box>
    </VStack>
  );
}
