import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { copyText, popSuccessToast } from '@shared/utils';

interface CopyButtonProps {
  onClick: IconButtonProps['onClick'];
}

interface CopyAreaProps {
  label?: string;
  value: string;
  isLoading?: boolean;
}

const LABELS = {
  copied: 'Copied successfully.',
};

export function CopyButton({ onClick }: CopyButtonProps) {
  return (
    <IconButton color="primary" size="small" onClick={onClick}>
      <Icon name="content_copy" sx={{ fontSize: '16px !important' }} />
    </IconButton>
  );
}

export function CopyArea({ label, value, isLoading = false }: CopyAreaProps) {
  const handleCopy = () => {
    copyText(value);
    popSuccessToast({
      description: LABELS.copied,
    });
  };

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          minWidth: 400,
          gap: 2,
          p: 6,
          borderRadius: '8px',
          boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)',
          bgcolor: 'common.white',
          width: 'fit-content',
        }}
      >
        <VStack alignItems="center" justifyContent="center" gap={2}>
          {label && (
            <Typography variant="bodyBold" sx={{ color: 'text.secondary' }}>
              {label}
            </Typography>
          )}
          <CircularProgress size={30} />
        </VStack>
      </Stack>
    );
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        minWidth: 400,
        gap: 2,
        p: 6,
        borderRadius: '8px',
        boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)',
        bgcolor: 'common.white',
        width: 'fit-content',
      }}
    >
      {label && (
        <Typography variant="bodyBold" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
      <HStack alignItems="center" gap={1}>
        <Typography
          component="span"
          variant={label ? 'bodyMedium' : 'bodyBold'}
          sx={{
            color: 'primary.main',
            ...(label && { fontStyle: 'italic' }),
          }}
        >
          {value}
        </Typography>
        <CopyButton onClick={handleCopy} />
      </HStack>
    </Stack>
  );
}
