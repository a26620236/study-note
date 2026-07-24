import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { sendGAEvent } from '@next/third-parties/google';

import { EVENT_COST_DASHBOARD, PlatformsValue } from '@constants';
import { useSinglePlatformResourceStatus } from '@hooks';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { initializePlatformFilters } from '../../utils/initializeFilter';
import { FilterPanelButtonWrapper } from './FilterPanelButtonWrapper';

export const FILTER_PANEL_BUTTON_LABELS = {
  resetButton: 'Reset',
  tooltip: {
    enabled: 'Reset all configuration options.',
    disabled: 'All configurations are already set to default.',
  },
};

/**
 * FilterPanelButton 元件
 * 提供 Reset 按鈕來重置所有 filter 設定
 */
export function FilterPanelButton() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleResetFilter } = useCostDashboardStore(
    (state) => state
  );
  const { isLoading } = useSinglePlatformResourceStatus({ platform });

  // 檢查是否為預設值
  const isDefault = useMemo(() => {
    if (platform === PlatformsValue.GCP) {
      const defaultFilter = initializePlatformFilters[PlatformsValue.GCP](platform);
      return JSON.stringify(platformAllFilters) === JSON.stringify(defaultFilter);
    }
    if (platform === PlatformsValue.AWS) {
      const defaultFilter = initializePlatformFilters[PlatformsValue.AWS](platform);
      return JSON.stringify(platformAllFilters) === JSON.stringify(defaultFilter);
    }
    const defaultFilter = initializePlatformFilters[PlatformsValue.AZURE](platform);
    return JSON.stringify(platformAllFilters) === JSON.stringify(defaultFilter);
  }, [platform, platformAllFilters]);

  const handleResetClick = () => {
    sendGAEvent('event', EVENT_COST_DASHBOARD.CLICK_FILTER_RESET, { platform });
    handleResetFilter(platform);
  };

  const tooltipTitle = isDefault
    ? FILTER_PANEL_BUTTON_LABELS.tooltip.disabled
    : FILTER_PANEL_BUTTON_LABELS.tooltip.enabled;

  return (
    <FilterPanelButtonWrapper>
      <Tooltip title={tooltipTitle}>
        <Box>
          <Button
            variant="outlined"
            disabled={isDefault || isLoading}
            onClick={handleResetClick}
            data-testid={`${platform}-filter-panel-button`}
          >
            {FILTER_PANEL_BUTTON_LABELS.resetButton}
          </Button>
        </Box>
      </Tooltip>
    </FilterPanelButtonWrapper>
  );
}
