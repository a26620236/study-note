'use client';

import { useParams } from 'next/navigation';

import { Paper, Typography } from '@mui/material';
import { format } from 'date-fns';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { nFormatAbbreviation } from '@shared/utils';
import { useTakeScreenshot } from '@shared/hooks';

import ScreenshotWrapper from '@components/ScreenshotWrapper';
import ResourceCell from '@components/table/ResourceCell';
import { Currency, PlatformsValue } from '@constants';
import { useGetAnomalyDetectionDetail } from '@hooks-api';

import type { AnomalyReportPageParams } from '../type';
import { AnomalyReportHeader } from './AnomalyReportHeader';
import { CostByTop10SpendingServicesSection } from './CostByTop10SpendingServicesSection';
import { GroupHierarchy } from './GroupHierarchy';
import { Top10ServicesCostBreakdownSection } from './Top10ServicesCostBreakdownSection';

const LABELS = {
  title: 'Anomaly Detection Report',
  alertInformation: {
    cost: 'Cost',
    resourceName: {
      gcp: 'Project Name / ID',
      aws: 'Account Name / ID',
      azure: 'Resource Group Name / ID',
    },
    assignedTo: 'Assigned to',
  },
  topCostResources: {
    title: 'Top 20 Highest Cost',
    description:
      'We recommend logging into your console to verify the accurate status and fees. The cost information here is for reference.',
  },
  anomalyDate: 'Anomaly Date',
  assignToGroup: {
    title: 'Assign to Group',
  },
  emptyState: {
    title: 'No Anomaly Alerts',
    desc: 'There are currently no anomaly alerts for your managed organization or group.',
  },
  error: {
    title: 'Anomaly Details Unavailable',
    desc: 'Unable to display anomaly data. Please ensure you have the necessary permissions and try again.',
  },
  screenshotMode: {
    description:
      'Note: This screenshot displays a summary of **the first 20 records from the "Top 10 Services: 36-Hour Cost Breakdown."**  \n Advanced metrics such as **Pricing Term** and **On-Demand Pricing** have been omitted for brevity.  \n To access the full dataset and utilize interactive analysis tools, please visit LumiTure.ai.',
  },
};

const AlertDetail = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <VStack gap={1} sx={{ width: '100%' }}>
    <Typography variant="captionBold" color="text.secondary">
      {label}
    </Typography>
    {children}
  </VStack>
);

export function AnomalyReport() {
  const { alertId } = useParams<AnomalyReportPageParams>();

  const { screenshotRef, isScreenshotMode, handleTakeScreenshot } = useTakeScreenshot({
    fileName: 'LumiTure_anomaly_report',
  });

  const { data } = useGetAnomalyDetectionDetail({
    alertId,
  });
  const { platform, costDate, resourceId, resourceName, totalCost, groups, trend } = data?.data ?? {
    platform: PlatformsValue.GCP,
    costDate: new Date().toISOString(),
    resourceId: '',
    resourceName: '',
    totalCost: {
      amount: 0,
      currency: Currency.USD,
    },
    groups: [],
    trend: {
      dates: [],
      ranking: [],
    },
  };

  function ReportDetails({ isScreenshotMode = false }: { isScreenshotMode?: boolean }) {
    return (
      <VStack gap={8} sx={{ width: '100%', minWidth: 0 }}>
        <AnomalyReportHeader
          isScreenshotMode={isScreenshotMode}
          onTakeScreenshot={handleTakeScreenshot}
        />

        {/* alert details */}
        <VStack sx={{ width: '100%' }}>
          <VStack gap={4} sx={{ mb: '45px' }}>
            <AlertDetail label={LABELS.alertInformation.resourceName[platform]}>
              <ResourceCell
                resourceName={resourceName}
                resourceId={resourceId}
                platform={platform}
                resourceNameVariant="h4"
              />
            </AlertDetail>

            <AlertDetail label={LABELS.alertInformation.cost}>
              <HStack alignItems="baseline" gap={2}>
                <Typography variant="h2">
                  {nFormatAbbreviation({ num: totalCost.amount })}
                </Typography>
                <Typography variant="captionBold">{totalCost.currency}</Typography>
              </HStack>
            </AlertDetail>

            <AlertDetail label={LABELS.anomalyDate}>
              <Typography variant="body1" color="text.secondary">
                {format(new Date(costDate), 'd/MM/yyyy')}
              </Typography>
            </AlertDetail>
          </VStack>

          <AlertDetail label={LABELS.alertInformation.assignedTo}>
            <GroupHierarchy data={groups} />
          </AlertDetail>
        </VStack>

        {/* cost by top 10 spending services */}
        <CostByTop10SpendingServicesSection data={trend} isScreenshotMode={isScreenshotMode} />

        {/* top 10 services cost breakdown */}
        <Top10ServicesCostBreakdownSection isScreenshotMode={isScreenshotMode} />
      </VStack>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%' }}>
        <ReportDetails />
      </Paper>

      {isScreenshotMode && (
        <ScreenshotWrapper ref={screenshotRef}>
          <VStack gap={4}>
            <Paper sx={{ width: '100%' }}>
              <ReportDetails isScreenshotMode />
            </Paper>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              <Markdown>{LABELS.screenshotMode.description}</Markdown>
            </Typography>
          </VStack>
        </ScreenshotWrapper>
      )}
    </>
  );
}
