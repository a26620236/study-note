import type { PropsWithChildren } from 'react';

import { Dialog, Link, Typography } from '@mui/material';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';

const LABELS = {
  title: 'Permission Denied',
  description:
    'Please check the permission settings in **Google Cloud Authorization Guide Step 4** and ensure the following:',
  requirements: `- The **Project ID** is correct (including detailed and pricing datasets).\n- The **Dataset name** is correct (including detailed and pricing datasets).\n- The Service Account has both **BigQuery Data Viewer** and **Billing Account Viewer** roles.`,
  button: 'Got it',
};

const markdownComponentsConfig = {
  p: ({ children }: PropsWithChildren) => (
    <Typography component="span" variant="body1">
      {children}
    </Typography>
  ),
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => (
    <Link
      sx={{ textDecoration: 'underline' }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ),
  ul: ({ children }: PropsWithChildren) => (
    <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>{children}</ul>
  ),
  li: ({ children }: PropsWithChildren) => <li style={{ fontSize: '14px' }}>{children}</li>,
};

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function GCPBillingIntegrationErrorDialog({ open, onClose }: ErrorDialogProps) {
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
              {LABELS.title}
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
          <Markdown components={markdownComponentsConfig}>{LABELS.description}</Markdown>
          <Markdown components={markdownComponentsConfig}>{LABELS.requirements}</Markdown>
        </VStack>

        {/* Footer */}
        <HStack justifyContent="flex-end">
          <Button variant="contained" onClick={onClose}>
            {LABELS.button}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}
