'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button, IconButton, Typography } from '@mui/material';
import { format, subMonths } from 'date-fns';

import { HStack, Icon } from '@lumiture-ui';
import { ScreenShot } from '@lumiture-ui/SvgIcon';

import { CostDashboardQueryKeys } from '@app/(main)/dashboard/cost/[platform]/constants/costDashboardQueryKeys';
import { DASHBOARD_PATHS, PlatformsValue } from '@constants';
import {
  AWSGroupBy,
  AzureGroupBy,
  GCPGroupBy,
  Granularity,
  useGetAnomalyDetectionDetail,
} from '@hooks-api';

import type { AnomalyReportPageParams } from '../type';

const LABELS = {
  title: 'Anomaly Detection Report',
  goBackButtonLabel: 'Anomaly Alert List',
  viewCostTrendButtonLabel: 'View 1-Month Cost Trend',
  date: 'Anomaly Cost Date',
};

interface AnomalyReportHeaderProps {
  onTakeScreenshot?: () => void;
  isScreenshotMode?: boolean;
  isLoading?: boolean;
}

export function AnomalyReportHeader({
  onTakeScreenshot,
  isScreenshotMode = false,
  isLoading = false,
}: AnomalyReportHeaderProps) {
  const router = useRouter();
  const { alertId } = useParams<AnomalyReportPageParams>();

  const { data } = useGetAnomalyDetectionDetail({ alertId });
  const { platform, costDate, resourceId } = data?.data ?? {
    platform: PlatformsValue.GCP,
    costDate: new Date().toISOString(),
    resourceId: '',
  };

  const handleNavigateToCostDashboard = () => {
    const groupBySku = {
      [PlatformsValue.GCP]: GCPGroupBy.Sku,
      [PlatformsValue.AWS]: AWSGroupBy.Sku,
      [PlatformsValue.AZURE]: AzureGroupBy.Sku,
    }[platform];

    const endDate = format(new Date(costDate), 'yyyy-MM-dd');
    const startDate = format(subMonths(new Date(costDate), 1), 'yyyy-MM-dd');

    const resourceIds = {
      [PlatformsValue.GCP]: resourceId,
      [PlatformsValue.AWS]: resourceId,
      [PlatformsValue.AZURE]: resourceId,
    }[platform];

    const key = {
      [PlatformsValue.GCP]: CostDashboardQueryKeys.Projects,
      [PlatformsValue.AWS]: CostDashboardQueryKeys.Accounts,
      [PlatformsValue.AZURE]: CostDashboardQueryKeys.ResourceGroups,
    }[platform];

    const filterValues = {
      [CostDashboardQueryKeys.Period]: Granularity.Day,
      [CostDashboardQueryKeys.GroupBy]: groupBySku,
      [CostDashboardQueryKeys.StartDate]: startDate,
      [CostDashboardQueryKeys.EndDate]: endDate,
      [key]: [resourceIds],
    };

    const queryParams = new URLSearchParams();
    queryParams.set('filter_values', JSON.stringify(filterValues));

    const baseUrl = DASHBOARD_PATHS.costDashboard.pathname.replace('[platform]', platform);
    const fullUrl = `${baseUrl}?${queryParams.toString()}`;

    router.push(fullUrl);
  };

  return (
    <HStack justifyContent="space-between">
      <Typography variant="h4">{LABELS.title}</Typography>
      {!isScreenshotMode && (
        <HStack alignItems="center" gap={2}>
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<Icon name="arrow_circle_right" />}
            onClick={handleNavigateToCostDashboard}
            disabled={isLoading}
          >
            <Typography variant="linkBold">{LABELS.viewCostTrendButtonLabel}</Typography>
          </Button>
          <IconButton onClick={onTakeScreenshot} disabled={isLoading}>
            <ScreenShot />
          </IconButton>
        </HStack>
      )}
    </HStack>
  );
}
