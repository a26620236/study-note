'use client';

import type { ReactNode } from 'react';

import { Box, Dialog, Typography, useTheme } from '@mui/material';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { nFormatter } from '@shared/utils';

import type { LumiTagPreviewOverview } from '@hooks-api';

import { UNTAGGED_NAME } from '../../constants/lumiTagPreview';

const LABELS = {
  title: 'Apply LumiTag',
  renderDescription: (tagName: string) =>
    `LumiTag **${tagName}** will be integrated as a primary dimension in all reports and dashboards. Please confirm the summary below:`,
  coveragePrefix: 'Applying this tag will cover ',
  coverageSuffix: ' of your total spend.',
  tagValues: 'Tag Values',
  coverageRate: 'Coverage Rate',
  untaggedSpend: 'Untagged Spend',
  cancel: 'Cancel',
  apply: 'Apply LumiTag',
} as const;

interface LumiTagSaveAsActiveDialogProps {
  open: boolean;
  tagName: string;
  overviewData: LumiTagPreviewOverview;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export function LumiTagSaveAsActiveDialog({
  open,
  tagName,
  overviewData,
  onClose,
  onConfirm,
  isSaving,
}: LumiTagSaveAsActiveDialogProps) {
  const theme = useTheme();
  const taggedValues = overviewData.values.filter((item) => item.name !== UNTAGGED_NAME);
  const untaggedItem = overviewData.values.find((item) => item.name === UNTAGGED_NAME);

  const taggedCost = taggedValues.reduce((sum, item) => sum + item.cost, 0);
  const unallocatedSpend = untaggedItem?.cost ?? 0;
  const coveragePct = overviewData.totalCost > 0 ? (taggedCost / overviewData.totalCost) * 100 : 0;
  const isFullyCovered = unallocatedSpend === 0;

  return (
    <Dialog open={open} slotProps={{ paper: { sx: { minWidth: 720 } } }}>
      <VStack gap={8}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" gap={2}>
            <Icon name="warning" fill sx={{ color: 'text.secondary', fontSize: 30 }} />
            <Typography variant="h4">{LABELS.title}</Typography>
          </HStack>
          <Icon
            name="close"
            sx={{ color: 'text.secondary', cursor: 'pointer' }}
            onClick={onClose}
          />
        </HStack>
        <Typography variant="body1">
          <Markdown>{LABELS.renderDescription(tagName)}</Markdown>
        </Typography>
        <VStack gap={2}>
          <Typography variant="body1">
            {LABELS.coveragePrefix}
            <Typography component="span" variant="bodyBold" color="primary.main">
              {nFormatter({ num: taggedCost, fixed: 2, prefix: 'USD ' })}
            </Typography>
            {LABELS.coverageSuffix}
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr"
            bgcolor={theme.palette.primary.light10}
            border={`1px solid ${theme.palette.primary.light20}`}
            borderRadius={2}
            p={4}
          >
            <SummaryColumn label={LABELS.tagValues}>
              <Typography variant="bodyBold">{taggedValues.length}</Typography>
            </SummaryColumn>
            <SummaryColumn label={LABELS.coverageRate}>
              {isFullyCovered ? (
                <GoodValue display="100%" />
              ) : (
                <Typography variant="bodyMedium">{coveragePct.toFixed(2)}%</Typography>
              )}
            </SummaryColumn>
            <SummaryColumn label={LABELS.untaggedSpend}>
              {isFullyCovered ? (
                <GoodValue display={nFormatter({ num: 0, fixed: 0, prefix: 'USD ' })} />
              ) : (
                <Typography variant="bodyBold" color="error.dark">
                  {nFormatter({ num: unallocatedSpend, fixed: 2, prefix: 'USD ' })}
                </Typography>
              )}
            </SummaryColumn>
          </Box>
        </VStack>
        <HStack gap={2} justifyContent="flex-end" mt={8}>
          <Button variant="outlined" onClick={onClose} disabled={isSaving}>
            {LABELS.cancel}
          </Button>
          <Button variant="contained" onClick={onConfirm} disabled={isSaving} isLoading={isSaving}>
            {LABELS.apply}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}

interface SummaryColumnProps {
  label: string;
  children: ReactNode;
}

function SummaryColumn({ label, children }: SummaryColumnProps) {
  return (
    <VStack gap={1}>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      {children}
    </VStack>
  );
}

function GoodValue({ display }: { display: string }) {
  return (
    <HStack gap={2} alignItems="center">
      <Icon name="thumb_up" fill sx={{ color: theme.palette.success.main, fontSize: 16 }} />
      <Typography variant="bodyBold" color="success.main">
        {display}
      </Typography>
    </HStack>
  );
}
