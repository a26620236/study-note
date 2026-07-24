'use client';

import { useState } from 'react';

import { Paper, Typography } from '@mui/material';

import { Button, HStack, Icon, ToggleGroup, VStack } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { usePostLoginActivityExport, usePostUserActivityExport } from '@hooks-api';

import { useLoginActivityStore } from '../../hooks/useLoginActivityStore';
import { useUserActivityStore } from '../../hooks/useUserActivityStore';
import { LoginActivityFilter } from '../LoginActivity/LoginActivityFilter';
import { LoginActivityTable } from '../LoginActivity/LoginActivityTable';
import { UserActivityFilter } from '../UserActivity/UserActivityFilter';
import { UserActivityTable } from '../UserActivity/UserActivityTable';

export enum AuditView {
  LoginActivity = 'LoginActivity',
  UserActivity = 'UserActivity',
}

export const toggleButtons = [
  {
    key: AuditView.LoginActivity,
    value: AuditView.LoginActivity,
    children: 'Login Activity',
  },
  {
    key: AuditView.UserActivity,
    value: AuditView.UserActivity,
    children: 'User Activity',
  },
];

export const LABELS = {
  title: 'Audit Log',
  subtitle: 'Monitor and track login and user activity across your organization.',
  exportCsv: 'Export CSV',
  exportSuccess: 'Export request sent. You will receive an email shortly.',
  exportError: 'Failed to export. Please try again.',
};

export function AuditLog() {
  const [activeView, setActiveView] = useState<AuditView>(AuditView.LoginActivity);

  const { filters: loginFilters, selectedUsers: loginSelectedUsers } = useLoginActivityStore();
  const { filters: userFilters, selectedUsers: userSelectedUsers } = useUserActivityStore();

  const loginExportPayload = {
    ...loginFilters,
    emails: loginSelectedUsers.flatMap((group) => group.values),
  };
  const userExportPayload = {
    ...userFilters,
    emails: userSelectedUsers.flatMap((group) => group.values),
  };

  const { mutate: exportLoginActivity, isPending: isLoginExportPending } =
    usePostLoginActivityExport({
      onSuccess: () => popSuccessToast({ description: LABELS.exportSuccess }),
      onError: () => popErrorToast({ description: LABELS.exportError }),
    });

  const { mutate: exportUserActivity, isPending: isUserExportPending } = usePostUserActivityExport({
    onSuccess: () => popSuccessToast({ description: LABELS.exportSuccess }),
    onError: () => popErrorToast({ description: LABELS.exportError }),
  });

  return (
    <VStack gap={6}>
      <VStack gap={0.5}>
        <Typography variant="h4">{LABELS.title}</Typography>
        <Typography variant="bodyMedium" color="text.secondary">
          {LABELS.subtitle}
        </Typography>
      </VStack>
      <HStack justifyContent="space-between" alignItems="center">
        <ToggleGroup
          toggleGroupProps={{
            value: activeView,
            exclusive: true,
            onChange: (_event, value: AuditView | null) => {
              if (value) setActiveView(value);
            },
          }}
          toggleButtons={toggleButtons}
        />
        <Button
          variant="contained"
          startIcon={<Icon name="download" />}
          onClick={() =>
            activeView === AuditView.LoginActivity
              ? exportLoginActivity(loginExportPayload)
              : exportUserActivity(userExportPayload)
          }
          disabled={
            activeView === AuditView.LoginActivity ? isLoginExportPending : isUserExportPending
          }
        >
          {LABELS.exportCsv}
        </Button>
      </HStack>
      <Paper sx={{ padding: 6 }}>
        <VStack gap={4}>
          {activeView === AuditView.LoginActivity && (
            <>
              <LoginActivityFilter />
              <LoginActivityTable />
            </>
          )}
          {activeView === AuditView.UserActivity && (
            <>
              <UserActivityFilter />
              <UserActivityTable />
            </>
          )}
        </VStack>
      </Paper>
    </VStack>
  );
}
