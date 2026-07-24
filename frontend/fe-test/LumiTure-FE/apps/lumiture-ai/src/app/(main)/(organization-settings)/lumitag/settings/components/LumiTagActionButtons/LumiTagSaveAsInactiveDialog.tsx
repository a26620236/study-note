'use client';

import type { PropsWithChildren } from 'react';

import { Box, Dialog, Typography } from '@mui/material';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { palette } from '@lumiture-ui/theme';

const LABELS = {
  title: 'Save as Inactive Tag',
  description: 'Do you want to save this tag as inactive?',
  note: `Please Note:\n- This tag will be hidden from reports while **inactive**.\n- The **Tag Key Name** is locked and cannot be modified to ensure the stability of existing references.`,
  cancel: 'Cancel',
  confirm: 'Save as Inactive Tag',
} as const;

interface LumiTagSaveAsInactiveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export function LumiTagSaveAsInactiveDialog({
  open,
  onClose,
  onConfirm,
  isSaving,
}: LumiTagSaveAsInactiveDialogProps) {
  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const markdownComponentsConfig = {
    p: ({ children }: PropsWithChildren) => (
      <Typography component="span" variant="body1">
        {children}
      </Typography>
    ),
    ul: ({ children }: PropsWithChildren) => (
      <ul style={{ margin: 0, paddingLeft: '32px', listStyleType: 'disc', fontSize: '0.7em' }}>
        {children}
      </ul>
    ),
    li: ({ children }: PropsWithChildren) => <li style={{ fontSize: '14px' }}>{children}</li>,
  };

  return (
    <Dialog
      open={open}
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          p: '24px 32px',
          margin: 0,
        },
      }}
    >
      <VStack gap="30px">
        <HStack justifyContent="space-between" alignItems="center">
          <HStack gap={4} alignItems="center">
            <Icon name="warning" sx={{ color: 'text.secondary', fontSize: 24 }} />
            <Typography variant="h4">{LABELS.title}</Typography>
          </HStack>
          <Icon name="close" onClick={handleClose} sx={{ cursor: 'pointer' }} />
        </HStack>
        <Typography variant="body1">{LABELS.description}</Typography>
        <Box
          sx={{
            border: `1px solid ${palette.gray.borderLight}`,
            borderRadius: '5px',
            p: 2,
            color: 'primary.main',
          }}
        >
          <Markdown components={markdownComponentsConfig}>{LABELS.note}</Markdown>
        </Box>
        <HStack gap="10px" justifyContent="flex-end" sx={{ marginTop: '30px' }}>
          <Button variant="outlined" onClick={handleClose} disabled={isSaving}>
            {LABELS.cancel}
          </Button>
          <Button onClick={onConfirm} disabled={isSaving} isLoading={isSaving}>
            {LABELS.confirm}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}
