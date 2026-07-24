import { Suspense } from 'react';

import { InstructionButton, InstructionName } from '@features';
import LayersIcon from '@mui/icons-material/Layers';
import Box from '@mui/material/Box';

import OrganizationTitle from '@components/OrganizationTitle';

import { AuthorizationListHydration } from './components/AuthorizationListHydration';
import { AuthorizationListSkeleton } from './components/AuthorizationListSkeleton';

const LABELS = {
  pageTitle: 'Authorization List',
  subTitle: 'Please add authorizations to this organization.',
  addAuthorization: 'Add Authorization',
};

export default function AuthorizationPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <OrganizationTitle
        title={LABELS.pageTitle}
        subTitle={LABELS.subTitle}
        icon={<LayersIcon />}
      />

      <InstructionButton name={InstructionName.AuthAndResourceAssignment} sx={{ mb: 4 }} />
      <Suspense fallback={<AuthorizationListSkeleton />}>
        <AuthorizationListHydration />
      </Suspense>
    </Box>
  );
}
