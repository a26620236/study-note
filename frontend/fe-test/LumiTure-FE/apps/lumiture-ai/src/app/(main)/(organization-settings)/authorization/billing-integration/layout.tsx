import type { PropsWithChildren } from 'react';

import LayersIcon from '@mui/icons-material/Layers';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import OrganizationTitle from '@components/OrganizationTitle';
import { MAIN_HEADER_HEIGHT } from '@constants';

import { BillingIntegrationPlatformTabs } from './components/BillingIntegrationPlatformTabs';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <OrganizationTitle
        title="Cloud Billing Data Integration"
        subTitle="Start your FinOps journey on LumiTure.ai by selecting the cloud service you want to integrate to your organization from the tabs below."
        icon={<LayersIcon />}
      />
      <BillingIntegrationPlatformTabs />
      <Stack
        sx={{
          gap: 4,
          overflowY: 'auto',
          py: 4,
          height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px - 194px)`,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
