'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, type SubmitHandler } from 'react-hook-form';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';
import { useScrollToFirstError } from '@shared/hooks';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import { DASHBOARD_PATHS } from '@constants';
import { useRouteProtection } from '@hooks';
import {
  createFiscalReportInvalidatePredicate,
  fiscalMetricsSettingsQueryKey,
  useGetFiscalMetricsSettings,
  usePostFiscalMetricsSettings,
} from '@hooks-api';

import {
  useFiscalMetricsForm,
  type ValidatedFiscalMetricsData,
} from '../hooks/useFiscalMetricsForm';
import { FiscalMetricsFieldsSkeleton } from './FiscalMetricsFieldsSkeleton';
import { FiscalMetricsSettingsCloudCostForecastSection } from './FiscalMetricsSettingsCloudCostForecastSection';
import { FiscalMetricsSettingsCloudCostPerCustomerSection } from './FiscalMetricsSettingsCloudCostPerCustomerSection';
import { FiscalMetricsSettingsCloudSpendRevenueSection } from './FiscalMetricsSettingsCloudSpendRevenueSection';
import { FiscalMetricsSettingsCVRSection } from './FiscalMetricsSettingsCVRSection';
import { FiscalStartMonthButton } from './FiscalStartMonthButton';
import { FiscalYearSelector } from './FiscalYearSelector';

const LABELS = {
  title: 'Fiscal Settings',
  subtitle: `Configure your fiscal year start month and key financial data to ensure your Executive Insights reflect your organization's real performance.<br/>Completing these settings allows you to unlock accurate ROI tracking, KPI monitoring, and empowering better strategic decisions.`,
  description: `**Please Note: The data above will be available for the selected fiscal year plus the next two years.** <br/>After this retention period, please make sure to download or back up any information you want to keep.`,
  discardChanges: 'Discard Changes',
  save: 'Save',
  success: 'Fiscal Settings updated successfully.',
  error: 'Unable to update Fiscal Settings. Please try again later.',
};

export function FiscalMetricsSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fiscalYear = searchParams.get('year');
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useGetFiscalMetricsSettings(fiscalYear);

  const formMethods = useFiscalMetricsForm({ data: data?.data });

  const { mutateAsync: postFiscalMetricsSettings } = usePostFiscalMetricsSettings();
  const scrollToFirstError = useScrollToFirstError();

  const { isDirty, isSubmitting } = formMethods.formState;

  useRouteProtection({
    isBlock: isDirty && !isSubmitting,
  });

  const handleSubmitSuccess: SubmitHandler<ValidatedFiscalMetricsData> = async (data) => {
    try {
      await postFiscalMetricsSettings(data);

      // invalidate fiscal report queries for a specific year
      queryClient.invalidateQueries({
        predicate: createFiscalReportInvalidatePredicate(fiscalYear ?? ''),
      });
      queryClient.invalidateQueries({ queryKey: fiscalMetricsSettingsQueryKey(fiscalYear) });

      popSuccessToast({ description: LABELS.success });

      router.push(DASHBOARD_PATHS.executiveInsights.pathname);
    } catch (error) {
      popErrorToast({ description: LABELS.error });
      console.error(error);
    }
  };

  const handleSubmitError = (errors: Record<string, unknown>) => {
    scrollToFirstError(errors);
  };

  const handleDiscardChanges = () => {
    router.push(DASHBOARD_PATHS.executiveInsights.pathname);
  };

  if (isLoading || isFetching) {
    return <FiscalMetricsFieldsSkeleton />;
  }

  return (
    <FormProvider {...formMethods}>
      <VStack sx={{ gap: 1, mb: 8, width: '100%' }}>
        <HStack justifyContent="space-between">
          <Typography variant="h4">{LABELS.title}</Typography>
          <HStack alignItems="center">
            <FiscalStartMonthButton />
            <FiscalYearSelector />
          </HStack>
        </HStack>
        <Typography variant="body1" color="text.secondary">
          <Markdown>{LABELS.subtitle}</Markdown>
        </Typography>
      </VStack>

      <VStack
        component="form"
        onSubmit={formMethods.handleSubmit(handleSubmitSuccess, handleSubmitError)}
        sx={{ gap: 5, width: '100%' }}
      >
        <FiscalMetricsSettingsCVRSection />
        <FiscalMetricsSettingsCloudSpendRevenueSection />
        <FiscalMetricsSettingsCloudCostPerCustomerSection />
        <FiscalMetricsSettingsCloudCostForecastSection />
        <Typography variant="caption" color="text.secondary" sx={{ mb: 6 }}>
          <Markdown>{LABELS.description}</Markdown>
        </Typography>
        {/* action buttons */}
        <FixedBottomBarWrapper>
          <Button variant="outlined" onClick={handleDiscardChanges} sx={{ ml: 'auto', mr: 4 }}>
            {LABELS.discardChanges}
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {LABELS.save}
          </Button>
        </FixedBottomBarWrapper>
      </VStack>
    </FormProvider>
  );
}
