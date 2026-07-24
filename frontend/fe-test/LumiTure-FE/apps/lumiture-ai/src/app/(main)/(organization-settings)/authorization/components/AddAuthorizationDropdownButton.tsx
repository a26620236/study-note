import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { sendGAEvent } from '@next/third-parties/google';

import { Button, DropdownButton, Icon } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { EVENT_RESOURCE_LIST, ORG_SETTINGS_PATHS, type PlatformsValue } from '@constants';

import type { UsageDataDisabledReason } from '../utils/getUsageDataDisabledReason';

interface AddAuthorizationDropdownButtonProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  usageDataDisabledReason: UsageDataDisabledReason;
  platform: PlatformsValue;
}

const LABELS = {
  buttonLabel: 'Add Authorization',
  dropdown: {
    billingData: 'billing data',
    usageData: 'usage data',
  },
  tooltipText: {
    noBilling:
      'To authorize the Scoping Project, you must first complete the authorization for its parent Billing Account.',
    allPaired:
      'Corresponding Billing data required. Each Usage data integration must be paired with corresponding billing integration. Please link a new billing source to proceed.',
  },
};

const usageDataTooltipMap: Record<NonNullable<UsageDataDisabledReason>, string> = {
  'no-billing': LABELS.tooltipText.noBilling,
  'all-paired': LABELS.tooltipText.allPaired,
};

export function AddAuthorizationDropdownButton({
  isOpen,
  onOpen,
  onClose,
  usageDataDisabledReason,
  platform,
}: AddAuthorizationDropdownButtonProps) {
  const router = useRouter();
  const dropdownList = useMemo(
    () => [
      {
        label: LABELS.dropdown.billingData,
        value: LABELS.dropdown.billingData,
        onClick: () => {
          sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_ADD_RESOURCE);
          router.push(
            ORG_SETTINGS_PATHS.billingDataIntegration.pathname.replace('[platform]', platform)
          );
        },
      },
      {
        label: LABELS.dropdown.usageData,
        value: LABELS.dropdown.usageData,
        onClick: () => {
          sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_ADD_RESOURCE);
          router.push(ORG_SETTINGS_PATHS.usageIntegration.pathname.replace('[platform]', platform));
        },
        disabled: usageDataDisabledReason !== null,
        tooltipText: usageDataDisabledReason ? usageDataTooltipMap[usageDataDisabledReason] : '',
      },
    ],
    [router, usageDataDisabledReason, platform]
  );

  return (
    <DropdownButton
      isOpen={isOpen}
      handleOpen={onOpen}
      handleClose={onClose}
      placement="bottom-end"
      button={
        <Button endIcon={<Icon name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'} />}>
          {LABELS.buttonLabel}
        </Button>
      }
      list={dropdownList}
      popperProps={{
        sx: {
          width: '175px',
          zIndex: theme.zIndex.dropdown,
        },
      }}
    />
  );
}
