import type { PropsWithChildren } from 'react';

import { Dialog, Typography } from '@mui/material';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';

import type { AWSBillingError } from './AWSBillingIntegration';

const QUOTA_EXCEEDED_LABELS = {
  title: 'Quota Exceeded',
  description:
    'Each AWS account is limited to **5 CUR 2.0** and **2 FOCUS** data exports. Please ensure your management account has not reached these specific limits before proceeding with the integration.',
  button: 'Got it',
};

const PERMISSION_DENIED_LABELS = {
  title: 'Permission Denied',
  description: 'Configuration error detected. This could be due to one of the following reasons:',
  requirements: `- Incorrect IAM information provided.\n- Missing required permissions in the policy to **create Billing Exports**.\n- Insufficient permissions to **update Lambda rules or S3 triggers**.\n- Improper policy attachment to the designated IAM user or role.`,
  button: 'Got it',
};

const markdownComponentsConfig = {
  p: ({ children }: PropsWithChildren) => (
    <Typography component="span" variant="body1">
      {children}
    </Typography>
  ),
  ul: ({ children }: PropsWithChildren) => (
    <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>{children}</ul>
  ),
  li: ({ children }: PropsWithChildren) => <li style={{ fontSize: '14px' }}>{children}</li>,
};

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
  awsError: AWSBillingError;
}

export function AWSBillingErrorDialog({ open, onClose, awsError }: InfoDialogProps) {
  const isQuotaExceeded = awsError === 'Quota Exceeded';
  return (
    <Dialog
      open={open}
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          p: '24px 32px',
          width: 675,
          margin: 0,
        },
      }}
    >
      <VStack gap={7.5}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <HStack gap={2} alignItems="center">
            <Icon name="warning" sx={{ fontSize: 24, color: 'text.secondary' }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {isQuotaExceeded ? QUOTA_EXCEEDED_LABELS.title : PERMISSION_DENIED_LABELS.title}
            </Typography>
          </HStack>
          <Icon
            name="close"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              fontSize: 24,
            }}
            onClick={onClose}
          />
        </HStack>

        {/* Content */}
        <VStack gap={3} alignItems="flex-start">
          <Markdown components={markdownComponentsConfig}>
            {isQuotaExceeded
              ? QUOTA_EXCEEDED_LABELS.description
              : PERMISSION_DENIED_LABELS.description}
          </Markdown>
          {awsError === 'Permission Denied' && (
            <Markdown components={markdownComponentsConfig}>
              {PERMISSION_DENIED_LABELS.requirements}
            </Markdown>
          )}
        </VStack>

        {/* Footer */}
        <HStack justifyContent="flex-end">
          <Button variant="contained" onClick={onClose}>
            {isQuotaExceeded ? QUOTA_EXCEEDED_LABELS.button : PERMISSION_DENIED_LABELS.button}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}
