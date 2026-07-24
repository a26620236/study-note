'use client';

import { useState, type PropsWithChildren } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogActions, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';

import { Button, HStack, Icon, Markdown, SingleSelect, VStack } from '@lumiture-ui';

interface FiscalStartMonthSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentFiscalStartMonth?: number;
  onSubmit: (month: number) => void;
  isSubmitting: boolean;
  featureName: string;
}

const TEST_PREFIX = 'fiscal-start-month-setting-dialog';

const LABELS = {
  title: 'Edit Start Month',
  description: `Please select your organization's fiscal year start month.`,
  getResultingFiscalYear: (range: string) => `Resulting fiscal year: ${range}`,
  warning: (featureName: string) =>
    `When you change the fiscal start month:\n- Your existing monthly data is preserved and remapped to the new FY range.\n- FY-based aggregations are recalculated automatically.\n- Changes will sync across all features, including **${featureName}**.\n- Incomplete required fields may affect data visibility on certain dashboards.`,
  actionButtons: {
    cancel: 'Cancel',
    save: 'Save',
  },
};

const MONTH_MAP = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const getResultingFiscalYearRange = (startMonth: number) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const fyStartYear = currentMonth >= startMonth ? currentYear : currentYear - 1;

  const start = new Date(fyStartYear, startMonth - 1, 1);
  const end = new Date(fyStartYear + 1, startMonth - 2, 1);

  return `FY${fyStartYear} (${format(start, 'MMM. yyyy')} – ${format(end, 'MMM. yyyy')})`;
};

export function FiscalStartMonthSettingDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentFiscalStartMonth,
  featureName,
}: FiscalStartMonthSettingDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentFiscalStartMonth ?? 1);

  const markdownComponentsConfig = {
    p: ({ children }: PropsWithChildren) => (
      <Typography component="span" variant="body1">
        {children}
      </Typography>
    ),
    ul: ({ children }: PropsWithChildren) => (
      <ul style={{ margin: 0, paddingLeft: '48px', listStyleType: 'disc' }}>{children}</ul>
    ),
    ol: ({ children }: PropsWithChildren) => (
      <ol style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>{children}</ol>
    ),
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <VStack gap={4}>
        <HStack sx={{ width: '100%', alignItems: 'center' }}>
          <Typography variant="h4">{LABELS.title}</Typography>
          <IconButton
            aria-label="close"
            color="secondary"
            onClick={onClose}
            sx={{ ml: 'auto' }}
            data-testid={`${TEST_PREFIX}-close-button`}
          >
            <CloseIcon />
          </IconButton>
        </HStack>

        <Typography variant="body1">{LABELS.description}</Typography>

        <SingleSelect
          configKey="fiscalYear"
          value={selectedMonth}
          options={Object.entries(MONTH_MAP).map(([month, name]) => ({
            id: Number(month),
            name,
          }))}
          onChange={({ value }) => {
            if (typeof value !== 'number') return;
            setSelectedMonth(value);
          }}
        />

        <Typography variant="bodyMedium">
          {LABELS.getResultingFiscalYear(getResultingFiscalYearRange(selectedMonth))}
        </Typography>

        <Box
          sx={{
            bgcolor: 'warning.bg',
            color: 'warning.main',
            borderRadius: '8px',
            p: 4,
            mb: 4,
          }}
        >
          <HStack alignItems="center" gap={1}>
            <Icon name="warning" sx={{ fontSize: 18, color: 'warning.main', mr: 1 }} />
            <Markdown components={markdownComponentsConfig}>{LABELS.warning(featureName)}</Markdown>
          </HStack>
        </Box>

        <DialogActions sx={{ gap: 2 }}>
          <Button onClick={onClose} variant="outlined" data-testid={`${TEST_PREFIX}-cancel-button`}>
            {LABELS.actionButtons.cancel}
          </Button>
          <Button
            type="submit"
            disabled={false}
            data-testid={`${TEST_PREFIX}-submit-button`}
            onClick={() => onSubmit(selectedMonth)}
            isLoading={isSubmitting}
          >
            {LABELS.actionButtons.save}
          </Button>
        </DialogActions>
      </VStack>
    </Dialog>
  );
}
