'use client';

import { useCallback, useMemo, type MouseEvent } from 'react';

import { BadgeToggleGroup, Button, HStack, Icon } from '@lumiture-ui';
import { downloadFile } from '@shared/utils';

import { RecommendStatus, useGetRightsizingOverview, usePostRecommendCsv } from '@hooks-api';

import { useRightsizingStore } from '../../hooks/useRightsizingStore';
import { ActionButtonWrapper } from './ActionButtonWrapper';

export function RightsizingToggleButton() {
  const { data: rightsizingOverviewResponse } = useGetRightsizingOverview();
  const postRecommendCsv = usePostRecommendCsv();
  const rightsizingOverview = rightsizingOverviewResponse?.data;

  const { selectedStatus, setSelectedStatus, clearSelection } = useRightsizingStore();

  const { recommendListAmounts: recommendationCounts } = rightsizingOverview ?? {};
  const { recommendations, done, dismiss } = recommendationCounts ?? {};

  const handleStatusChange = useCallback(
    (_event: MouseEvent<HTMLElement>, value: RecommendStatus | null) => {
      if (!value) return;
      setSelectedStatus(value);
      clearSelection();
    },
    [clearSelection, setSelectedStatus]
  );

  const toggleButtons = useMemo(() => {
    const statusConfigurations = [
      { status: RecommendStatus.Recommendations, count: recommendations ?? 0 },
      { status: RecommendStatus.Done, count: done ?? 0 },
      { status: RecommendStatus.Dismiss, count: dismiss ?? 0 },
      { status: RecommendStatus.Archived, count: 0, hideBadge: true },
    ];

    return statusConfigurations.map(({ status, count, hideBadge }) => ({
      key: status,
      value: status,
      count,
      hideBadge,
      children: status,
    }));
  }, [dismiss, done, recommendations]);

  const handleExportCsv = useCallback(async () => {
    try {
      const res = await postRecommendCsv.mutateAsync({ status: selectedStatus });
      if (!res.data.link) return;
      downloadFile({ downloadUrl: res.data.link, filename: `rightsizing_${selectedStatus}.csv` });
    } catch (error) {
      console.error(error);
    }
  }, [postRecommendCsv, selectedStatus]);

  return (
    <HStack mt={4} justifyContent="space-between">
      <BadgeToggleGroup
        toggleGroupProps={{
          value: selectedStatus,
          onChange: handleStatusChange,
          exclusive: true,
        }}
        toggleButtons={toggleButtons}
        maxDisplayCount={999}
      />
      <HStack gap={2} alignItems="center">
        <ActionButtonWrapper />
        <Button startIcon={<Icon name="download" />} onClick={handleExportCsv}>
          Export CSV
        </Button>
      </HStack>
    </HStack>
  );
}
