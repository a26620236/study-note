import type { PropsWithChildren } from 'react';

import LayersIcon from '@mui/icons-material/Layers';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import OrganizationTitle from '@components/OrganizationTitle';
import { MAIN_HEADER_HEIGHT } from '@constants';

import { UsageIntegrationPlatformTabs } from './components/UsageIntegrationPlatformTabs';

const LABELS = {
  title: 'Usage Data Integration',
  subTitle:
    'Start your FinOps journey on LumiTure.ai by selecting the cloud service you want to integrate to your organization from the tabs below.',
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <OrganizationTitle title={LABELS.title} subTitle={LABELS.subTitle} icon={<LayersIcon />} />
      <UsageIntegrationPlatformTabs />
      <Stack
        sx={{
          gap: 4,
          overflowY: 'auto',
          py: 8,
          height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px - 194px)`,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
