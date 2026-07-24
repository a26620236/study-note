'use client';

import React from 'react';

import Typography from '@mui/material/Typography';
import { isEmpty } from 'lodash-es';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { useTakeScreenshot } from '@shared/hooks';

import ScreenshotWrapper from '@components/ScreenshotWrapper';
import { useGetResourcesAssignmentStatus } from '@hooks-api';

import NoAuthorization from '../../../components/NoAuthorization/NoAuthorization';
import { useGetFiscalReportQuery } from '../hooks/useGetFiscalReportQuery';
import { BeginInsightsJourneyPage } from './BeginInsightsJourneyPage';
import { CloudCostForecastSection } from './CloudCostForecastSection';
import { CloudCostPerCustomerSection } from './CloudCostPerCustomerSection/CloudCostPerCustomerSection';
import { CloudSpendRevenueSection } from './CloudSpendRevenueSection';
import { CostByFOCUSSection } from './CostByFOCUSSection';
import { CVRSection } from './CVRSection/CVRSection';
import { ExecutiveInsightsPageHeader } from './ExecutiveInsightsPageHeader';
import { ExecutiveInsightsSkeleton } from './ExecutiveInsightsSkeleton/ExecutiveInsightsSkeleton';
import { Top10OverspendGroupsSection } from './Top10OverspendGroupsSection/Top10OverspendGroupsSection';
import { Top10SpendingGroupsSection } from './Top10SpendingGroupsSection/Top10SpendingGroupsSection';

const LABELS = {
  footer: `Please note that LumiTure.ai values may slightly differ from your console<br/>due to variations in cloud provider time zones, currency settings, and the <strong>EXCLUSION OF CREDITS</strong> on this page.<br/>
  LumiTure.ai aims providing a comprehensive overview of your cloud spending.<br/>We appreciate your understanding and trust in our platform to help you optimize your cloud costs.`,
  title: 'Executive Insights',
  lastUpdated: 'Last Updated',
  noAuthorization: {
    title: 'Unlock the Value of Your Cloud Investments Today',
    desc: `Begin your cloud cost optimization journey by authorizing your first cloud account. \nOnce connected, you'll gain a comprehensive view of your cloud performance, allowing you to track key ROI and KPI metrics. \nThis empowers you to make informed decisions to improve your investments and easily identify cost-saving opportunities.`,
  },
};

function Footer() {
  return (
    <Markdown
      components={{
        p: ({ children }) => (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
            {children}
          </Typography>
        ),
      }}
    >
      {LABELS.footer}
    </Markdown>
  );
}

export function ExecutiveInsights() {
  const { screenshotRef, isScreenshotMode, handleTakeScreenshot } = useTakeScreenshot({
    fileName: 'LumiTure_executive_insights',
  });
  const {
    data: fiscalReport,
    isLoading: isLoadingFiscalReport,
    isFetching: isFetchingFiscalReport,
  } = useGetFiscalReportQuery();
  const { data: resourcesAssignmentStatus } = useGetResourcesAssignmentStatus();
  const hasAssignedResources = resourcesAssignmentStatus?.data.hasAssignedResources;

  const isLoading = isLoadingFiscalReport || isFetchingFiscalReport;

  if (isLoading) {
    return <ExecutiveInsightsSkeleton />;
  }

  if (!hasAssignedResources) {
    return (
      <NoAuthorization
        adminTitle={LABELS.noAuthorization.title}
        adminDesc={LABELS.noAuthorization.desc}
        nonAdminTitle={LABELS.noAuthorization.title}
        nonAdminDesc={LABELS.noAuthorization.desc}
      />
    );
  }

  if (isEmpty(fiscalReport?.data)) {
    return <BeginInsightsJourneyPage />;
  }

  const MainContent = () => (
    <>
      <CVRSection />
      <HStack sx={{ gap: 4 }}>
        <CloudSpendRevenueSection />
        <CloudCostPerCustomerSection />
        <CloudCostForecastSection />
      </HStack>
      <Top10OverspendGroupsSection />
      <Top10SpendingGroupsSection />
      <CostByFOCUSSection />
    </>
  );

  return (
    <>
      <VStack gap={4}>
        <ExecutiveInsightsPageHeader onTakeScreenshot={handleTakeScreenshot} />
        <MainContent />
      </VStack>

      {isScreenshotMode && (
        <ScreenshotWrapper ref={screenshotRef}>
          <VStack gap={4}>
            <ExecutiveInsightsPageHeader onTakeScreenshot={handleTakeScreenshot} isScreenshotMode />
            <MainContent />
          </VStack>
          <Footer />
        </ScreenshotWrapper>
      )}
    </>
  );
}
