import { Paper, Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import NoAuthorization from '@app/(main)/components/NoAuthorization/NoAuthorization';

const LABELS = {
  title: 'Rightsizing',
  adminDesc:
    "Begin your cloud cost optimization journey by authorizing your cloud account.\nYou'll be able to identify underutilized instances, compare estimated vs. actual savings,\n and take action to maximize efficiency while reducing unnecessary cloud spend.",
  nonAdminDesc:
    "To kickstart your cloud cost optimization journey,\n please reach out to your organization's administrator for authorization.",
};

export function RightsizingNoAuth() {
  return (
    <VStack gap={8} height="100%" flexWrap="nowrap">
      <Typography variant="h4">{LABELS.title}</Typography>
      <Paper sx={{ height: '100%' }}>
        <NoAuthorization adminDesc={LABELS.adminDesc} nonAdminDesc={LABELS.nonAdminDesc} />
      </Paper>
    </VStack>
  );
}
