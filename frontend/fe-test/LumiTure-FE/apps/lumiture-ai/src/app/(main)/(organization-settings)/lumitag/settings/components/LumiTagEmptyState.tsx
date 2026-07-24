'use client';

import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';
import { palette } from '@lumiture-ui/theme';

const LABELS = {
  title: 'No Value Added',
  subtitle: 'Add value and condition to define the tag scope.',
};

interface LumiTagEmptyStateProps {
  hasError: boolean;
}

export function LumiTagEmptyState({ hasError }: LumiTagEmptyStateProps) {
  return (
    <VStack
      sx={{
        border: '1px dashed',
        borderColor: hasError ? 'error.main' : palette.text.secondary,
        borderRadius: '8px',
        py: 8,
        textAlign: 'center',
        backgroundColor: palette.primary.light10,
        gap: 2,
      }}
      data-testid="lumiTag-empty-state"
    >
      <Typography variant="h6" color="text.secondary">
        {LABELS.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {LABELS.subtitle}
      </Typography>
    </VStack>
  );
}
