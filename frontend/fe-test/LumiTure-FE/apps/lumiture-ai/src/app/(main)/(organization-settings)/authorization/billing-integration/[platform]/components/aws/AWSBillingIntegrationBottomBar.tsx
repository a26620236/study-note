import { alpha, Box, Tooltip, Typography } from '@mui/material';
import { sendGAEvent } from '@next/third-parties/google';

import { Button, HStack, Icon } from '@lumiture-ui';
import { palette } from '@lumiture-ui/theme';

import { BillingIntegrationStep } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/constants';
import { EVENT_RESOURCE_LIST, PlatformsValue } from '@constants';

const LABELS = {
  goToSetAuthorization: 'Go to set AWS Authorization',
  backToGuide: 'Back to Authorization Guide',
  permissionCheck: 'Permission Check',
  integrate: 'Integrate',
  permissionCheckTooltip: 'You should process "Permission Check" first.',
};

interface AWSBillingIntegrationBottomBarProps {
  page: BillingIntegrationStep;
  setPage: (page: BillingIntegrationStep) => void;
  isPermissionChecked: boolean;
  isPermissionCheckPending: boolean;
  handlePermissionCheck: () => void;
  isIntegrationPending: boolean;
  formId: string;
}

export function AWSBillingIntegrationBottomBar({
  page,
  setPage,
  isPermissionChecked,
  isPermissionCheckPending,
  handlePermissionCheck,
  isIntegrationPending,
  formId,
}: AWSBillingIntegrationBottomBarProps) {
  if (page === BillingIntegrationStep.Guide) {
    return (
      <Button
        sx={{ ml: 'auto', bgcolor: 'primary.main', color: 'white' }}
        onClick={() => {
          sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_GO_RESOURCE_FORM, {
            platform: PlatformsValue.AWS,
          });
          setPage(BillingIntegrationStep.Authentication);
        }}
      >
        {LABELS.goToSetAuthorization}
      </Button>
    );
  }

  return (
    <HStack justifyContent="space-between" width="100%">
      <Box
        onClick={() => setPage(BillingIntegrationStep.Guide)}
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          color: 'primary.main',
          cursor: 'pointer',
        }}
      >
        <Icon name="arrow_circle_left" sx={{ fontSize: 16 }} />
        <Typography sx={{ textDecoration: 'underline' }}>{LABELS.backToGuide}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          isLoading={isPermissionCheckPending}
          disabled={isPermissionCheckPending || isPermissionChecked}
          onClick={handlePermissionCheck}
          sx={{
            bgcolor: isPermissionChecked ? alpha(palette.black.main, 0.12) : 'primary.main',
            minWidth: '150px',
          }}
          startIcon={isPermissionChecked && <Icon name="check_circle" sx={{ fontSize: 20 }} />}
        >
          {LABELS.permissionCheck}
        </Button>
        <Tooltip title={isPermissionChecked ? null : LABELS.permissionCheckTooltip}>
          <Box>
            <Button
              isLoading={isIntegrationPending}
              disabled={isIntegrationPending || !isPermissionChecked}
              type="submit"
              form={formId}
              sx={{
                bgcolor: isPermissionChecked ? 'primary.main' : alpha(palette.black.main, 0.12),
                color: 'white',
              }}
            >
              {LABELS.integrate}
            </Button>
          </Box>
        </Tooltip>
      </Box>
    </HStack>
  );
}
