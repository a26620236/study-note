import { useParams } from 'next/navigation';

import { Paper, Tooltip, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';
import { GoogleIcon } from '@lumiture-ui/SvgIcon';

import NoAuthorization from '@app/(main)/components/NoAuthorization/NoAuthorization';
import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import { CrossCloudValue, type PlatformValueWithFOCUS } from '@constants';
import { useSinglePlatformResourceStatus } from '@hooks';

import { GCP_FOCUS_TOOLTIP } from '../../constants/focusTooltip';
import { AIInsightCenter } from '../AIInsightCenter/AIInsightCenter';
import { CostDetailTable } from '../CostDetail/CostDetailTable';
import { CostTrend } from '../CostTrend/CostTrend';
import { CostDashboardPlatformContentSkeleton } from './CostDashboardPlatformContentSkeleton';

const LABELS = {
  focusNotice:
    '*To ensure data accuracy, Google Cloud services not yet aligned with FOCUS standards are marked with',
} as const;

export function CostDashboardPlatformContent() {
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { isEmpty, isLoading: isResourceLoading } = useSinglePlatformResourceStatus({ platform });

  const isFOCUS = platform === CrossCloudValue.FOCUS;

  if (isResourceLoading) return <CostDashboardPlatformContentSkeleton />;

  return (
    <VStack mt={8} gap={5}>
      {isEmpty ? (
        <NoAuthorization
          adminDesc={CUSTOMIZED_EMPTY_CONTENT.dashboardNoAuthAdmin.desc}
          nonAdminDesc={CUSTOMIZED_EMPTY_CONTENT.dashboardNoAuthNonAdmin.desc}
        />
      ) : (
        <>
          {!isFOCUS && <AIInsightCenter />}
          <Paper sx={{ p: 6, width: '100%' }}>
            <CostTrend />
            <CostDetailTable />
            {isFOCUS && (
              <Tooltip title={GCP_FOCUS_TOOLTIP}>
                <HStack justifyContent="center" alignItems="center" gap={1} mt={4}>
                  <Typography variant="caption" color="text.hint" fontStyle="italic">
                    {LABELS.focusNotice}
                  </Typography>
                  <GoogleIcon />
                </HStack>
              </Tooltip>
            )}
          </Paper>
        </>
      )}
    </VStack>
  );
}
