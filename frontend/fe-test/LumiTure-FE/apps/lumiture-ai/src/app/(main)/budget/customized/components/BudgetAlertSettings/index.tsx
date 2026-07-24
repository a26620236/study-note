import React from 'react';

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AlertSettingsForm from '@app/(main)/budget/customized/components/BudgetAlertSettings/AlertSettingsForm';
import BudgetSettingsForm from '@app/(main)/budget/customized/components/BudgetAlertSettings/BudgetSettingsForm';
import { LoadingBudgetSettings } from '@app/(main)/budget/customized/components/BudgetAlertSettings/Loading';

interface BudgetAlertSettingsProps {
  isBatchMode: boolean;
  isLoading?: boolean;
  isEditing?: boolean;
}

const BudgetAlertSettings = ({
  isBatchMode,
  isLoading = false,
  isEditing = false,
}: BudgetAlertSettingsProps) => (
  <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Stack direction="row" sx={{ gap: 8 }}>
      <Stack sx={{ flex: 1, gap: 8 }}>
        <Typography variant="h5">Budget Settings</Typography>
        {isLoading ? (
          <LoadingBudgetSettings />
        ) : (
          <BudgetSettingsForm isBatchMode={isBatchMode} isEditing={isEditing} />
        )}
      </Stack>
      <Stack sx={{ flex: 1, gap: 8 }}>
        <Typography variant="h5">Alert Settings</Typography>
        <AlertSettingsForm isLoading={isLoading} />
      </Stack>
    </Stack>
    {isBatchMode && (
      <>
        <Divider />
        <Typography>
          All budgets that are batch created will have these settings applied.
        </Typography>
      </>
    )}
  </Paper>
);

export default BudgetAlertSettings;
