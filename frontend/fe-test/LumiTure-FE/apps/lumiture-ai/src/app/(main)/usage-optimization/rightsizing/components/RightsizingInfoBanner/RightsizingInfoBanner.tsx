import { useRouter } from 'next/navigation';

import { Button, HStack, Icon } from '@lumiture-ui';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import { OPTIMIZATION_PATHS } from '@constants';
import { useGetRightsizingOverview } from '@hooks-api';

import { RightsizingInfoBannerDescription } from './RightsizingInfoBannerDescription';

const LABELS = {
  button: 'Scope Settings',
};

export function RightsizingInfoBanner() {
  const router = useRouter();
  const { data: overviewResponse } = useGetRightsizingOverview();
  const overviewData = overviewResponse?.data;
  const scopeSettings = !!overviewData?.scopeSettings;

  const handleRightsizingSettingsClick = () => {
    router.push(OPTIMIZATION_PATHS.usageOptimizationScopeSettings.pathname);
  };

  return (
    <HStack alignItems="center" justifyContent="space-between" flexWrap="nowrap" mt={2}>
      <RightsizingInfoBannerDescription />
      <HStack gap={2} alignItems="center" flexWrap="nowrap">
        <CurrencySelector />
        <Button
          startIcon={<Icon name="settings" />}
          onClick={handleRightsizingSettingsClick}
          disabled={!scopeSettings}
        >
          {LABELS.button}
        </Button>
      </HStack>
    </HStack>
  );
}
