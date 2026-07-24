'use client';

import { Paper, Skeleton, Typography } from '@mui/material';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';

import { LumiTagSettingsToolbar } from './LumiTagSettingsToolbar';

const LABELS = {
  tagKey: 'Tag Key',
  tagValues: 'Tag Values',
  explanation: `A cost record matches this tag value when **ANY** data source block's conditions are met.\n\nWithin each block, conditions are evaluated from left to right. Use **AND** to narrow results or **OR** to broaden them. Each block supports up to 20 conditions.\n\nTo ensure data integrity, values are applied by **priority order**. Each resource is mapped to a single value within this key's scope, with automatic deduplication across rules.\n\nNote: Data will not be allocated to this tag value if no conditions are met.`,
  button: {
    cancel: 'Cancel',
    saveAsInactive: 'Save as Inactive Tag',
    coveragePreview: 'Coverage Preview',
    addValue: '+ Add Value',
  },
  saveAsInactive: 'Save as Inactive Tag',
  coveragePreview: 'Coverage Preview',
};

function ActionButtons() {
  return (
    <FixedBottomBarWrapper>
      <HStack sx={{ gap: 2, width: '100%', justifyContent: 'space-between' }}>
        <Button variant="outlined" disabled data-testid="lumiTag-cancel-button">
          {LABELS.button.cancel}
        </Button>
        <HStack sx={{ gap: 2 }}>
          <Button variant="outlined" color="primary" disabled data-testid="lumiTag-save-button">
            {LABELS.saveAsInactive}
          </Button>
          <Button variant="contained" color="primary" disabled data-testid="lumiTag-preview-button">
            {LABELS.coveragePreview}
          </Button>
        </HStack>
      </HStack>
    </FixedBottomBarWrapper>
  );
}

export function LumiTagSettingsSkeleton() {
  return (
    <>
      <VStack sx={{ gap: 5, marginTop: 5 }}>
        <LumiTagSettingsToolbar />
        <Paper sx={{ p: '24px 24px 44px 24px' }}>
          <VStack sx={{ gap: 2 }}>
            <Typography variant="h5">{LABELS.tagKey}</Typography>
            <Skeleton variant="rounded" width={200} height={36} />
          </VStack>
        </Paper>
        <Paper>
          <VStack sx={{ gap: 4 }}>
            <HStack sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">{LABELS.tagValues}</Typography>
              <Button
                variant="contained"
                size="small"
                disabled
                data-testid="lumiTag-add-value-button"
              >
                {LABELS.button.addValue}
              </Button>
            </HStack>
            <Skeleton variant="rounded" width="100%" height={120} />
            <VStack>
              <Markdown
                components={{
                  p: ({ children }) => (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {children}
                    </Typography>
                  ),
                }}
              >
                {LABELS.explanation}
              </Markdown>
            </VStack>
          </VStack>
        </Paper>
      </VStack>
      <ActionButtons />
    </>
  );
}
