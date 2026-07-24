'use client';

import { useState } from 'react';

import { Paper } from '@mui/material';

import { VStack } from '@lumiture-ui';

import NoAuthorization from '@app/(main)/components/NoAuthorization/NoAuthorization';
import EmptyState from '@components/EmptyState/EmptyState';
import {
  useGetAnomalyDetectionList,
  useGetAnomalyDetectionSettings,
  useGetResourcesAssignmentStatus,
  type AnomalyDetectionItem,
} from '@hooks-api';

import { AnomalyToggleCategory, Sensitivity } from '../constants';
import { AnomalyAlertListTable } from './AnomalyAlertListTable/AnomalyAlertListTable';
import { AnomalySettingsDialog } from './AnomalySettingsDialog/AnomalySettingsDialog';
import { AnomalyToolbar } from './AnomalyToolbar';

const LABELS = {
  emptyState: {
    title: 'No Anomaly Alerts',
    desc: 'There are currently no anomaly alerts for your managed organization or group.',
  },
  error: {
    title: 'Something Went Wrong',
    desc: 'Please ensure you have a stable internet connection and try refreshing the page.',
  },
  noAuthorization: {
    adminDesc: `Begin your cloud cost optimization journey by authorizing your cloud account. You can monitor spending anomalies within your managed organization or groups, set anomaly detection criteria and notification settings as needed,
    and stay informed about your organization's cloud spending anytime, anywhere.`,
    nonAdminDesc: `To kickstart your cloud cost optimization journey, please reach out to your organization's administrator for authorization.You can monitor spending anomalies within your managed organization or groups,
    and stay informed about your organization's cloud spending anytime, anywhere.`,
  },
  sensitivity: {
    [Sensitivity.Low]: 'Low',
    [Sensitivity.Medium]: 'Medium',
    [Sensitivity.High]: 'High',
  },
};

const getSensitivityLabel = (sensitivity?: Sensitivity) => {
  if (sensitivity === undefined) return '';

  return LABELS.sensitivity[sensitivity];
};

const filterPinnedItems = (items: AnomalyDetectionItem[]): AnomalyDetectionItem[] =>
  items.reduce<AnomalyDetectionItem[]>((acc, item) => {
    if (item.pin) {
      acc.push({ ...item, children: undefined });
    }
    if (item.children?.length) {
      acc.push(...filterPinnedItems(item.children));
    }
    return acc;
  }, []);

export function Anomaly() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<AnomalyToggleCategory>(AnomalyToggleCategory.All);

  const { data: anomalyDetectionList } = useGetAnomalyDetectionList();
  const { data: anomalyDetectionSettings } = useGetAnomalyDetectionSettings();
  const { data: resourcesAssignmentStatus } = useGetResourcesAssignmentStatus();
  const hasAssignedResources = resourcesAssignmentStatus?.data.hasAssignedResources;

  const { availableActions, detection, sensitivity } = anomalyDetectionSettings?.data ?? {};
  const canEditSettings = availableActions?.editSettings ?? false;
  const anomalyDetectionListData = anomalyDetectionList?.data ?? [];
  const hasAnomaly = anomalyDetectionListData.length > 0;

  const anomalyAlertListData =
    category === AnomalyToggleCategory.Pinned
      ? filterPinnedItems(anomalyDetectionListData)
      : anomalyDetectionListData;

  if (!hasAssignedResources) {
    return (
      <Paper>
        <NoAuthorization
          adminDesc={LABELS.noAuthorization.adminDesc}
          nonAdminDesc={LABELS.noAuthorization.nonAdminDesc}
        />
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%' }}>
        <VStack gap={4}>
          <AnomalyToolbar
            hasAnomaly={hasAnomaly}
            sensitivity={detection ? getSensitivityLabel(sensitivity) : undefined}
            canEditSettings={canEditSettings}
            onSettingsClick={() => setIsOpen(true)}
            category={category}
            setCategory={setCategory}
          />
          {hasAnomaly ? (
            <AnomalyAlertListTable
              data={anomalyAlertListData}
              enableExpanding={category === AnomalyToggleCategory.All}
            />
          ) : (
            <EmptyState
              size="medium"
              type="emptyList"
              title={LABELS.emptyState.title}
              desc={LABELS.emptyState.desc}
            />
          )}
        </VStack>
      </Paper>

      {anomalyDetectionSettings?.data && (
        <AnomalySettingsDialog
          isOpen={isOpen}
          data={anomalyDetectionSettings.data}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
