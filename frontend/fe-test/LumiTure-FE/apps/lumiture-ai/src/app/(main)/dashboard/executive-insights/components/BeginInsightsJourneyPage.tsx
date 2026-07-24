'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FiscalStartMonthSettingDialog } from '@features';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { Markdown, VStack } from '@lumiture-ui';
import { Spark } from '@lumiture-ui/SvgIcon';

import EmptyState from '@components/EmptyState/EmptyState';
import { DASHBOARD_PATHS } from '@constants';
import { usePatchFiscalStartMonth } from '@hooks-api';

const LABELS = {
  title: 'Executive Insights',
  generalBudget: 'General Budget',
  beginMyInsightsJourney: {
    title: 'Your Journey to Smarter Cloud Decisions Starts Here',
    desc: `Provide just a few key details to set up your fiscal profile. <br/>This one-time setup will unlock LumiTure.ai's ability to generate personalized executive insights. <br/>Helping you gain clarity, discover hidden cost-saving opportunities, and make smarter business decisions with confidence.`,
    button: 'Begin My Insights Journey',
  },
};

export function BeginInsightsJourneyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: patchFiscalStartMonth, isPending: isPatchFiscalStartMonthPending } =
    usePatchFiscalStartMonth();

  const handleSubmit = async (selectedMonth: number) => {
    try {
      await patchFiscalStartMonth({ month: selectedMonth });
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const year = selectedMonth >= currentMonth ? currentYear - 1 : currentYear;

      router.push(`${DASHBOARD_PATHS.executiveInsightsSettings.pathname}?year=${year}`);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <VStack sx={{ gap: 8, height: '100%' }}>
        <Typography variant="h4">{LABELS.title}</Typography>
        <Paper sx={{ flex: 1 }}>
          <EmptyState
            type="noAuth"
            size="medium"
            title={LABELS.beginMyInsightsJourney.title}
            desc={<Markdown>{LABELS.beginMyInsightsJourney.desc}</Markdown>}
            iconSymbol="query_stats"
          >
            <Button
              startIcon={<Spark sx={{ color: 'primary.main', fontSize: 16 }} />}
              sx={{ mt: 6 }}
              onClick={() => setIsOpen(true)}
            >
              {LABELS.beginMyInsightsJourney.button}
            </Button>
          </EmptyState>
        </Paper>
      </VStack>
      {isOpen && (
        <FiscalStartMonthSettingDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isPatchFiscalStartMonthPending}
          featureName={LABELS.generalBudget}
        />
      )}
    </>
  );
}
