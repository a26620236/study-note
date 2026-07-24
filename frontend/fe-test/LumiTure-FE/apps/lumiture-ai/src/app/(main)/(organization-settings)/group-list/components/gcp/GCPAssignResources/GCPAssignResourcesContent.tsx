import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import {
  Button,
  GroupedMultiSelect,
  HStack,
  Icon,
  VStack,
  type GroupData,
  type SelectedData,
} from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import { useGetGCPAvailableResources, usePutGCPAssignedResources } from '@hooks-api';

import { useGCPAssignedResourceData } from '../../../hooks/useGCPAssignedResourceData';
import type { GroupParams } from '../../../types/params';
import { invalidateResourceQueries } from '../../../utils/invalidateResourceQueries';
import { popToastWithResource } from '../../../utils/popToastWithResource';
import { AssignResourceSelectSkeleton } from '../../AssignResourceSelectSkeleton';

const LABELS = {
  title: 'Assign Resource: Google Cloud',
  subtitle: 'Select the Google Cloud resources you want to assign to this group.',
  cancelButtonLabel: 'Cancel',
  assignButtonLabel: 'Assign',
};

interface GCPAssignResourcesContentProps {
  selectedResources: SelectedData;
  setSelectedResources: (value: SelectedData) => void;
  handleCloseDialog: () => void;
}

export function GCPAssignResourcesContent({
  selectedResources,
  setSelectedResources,
  handleCloseDialog: handleCloseDialogProps,
}: GCPAssignResourcesContentProps) {
  const queryClient = useQueryClient();
  const params = useParams<GroupParams>();
  const { groupId } = useGCPAssignedResourceData();
  const { data: availableResources, isLoading: isLoadingAvailableResources } =
    useGetGCPAvailableResources(groupId);
  const { mutateAsync: assignResources, isPending: isAssignPending } = usePutGCPAssignedResources();
  const groupedResourcesOption = useMemo<GroupData>(() => {
    if (!availableResources?.data) return [];
    return availableResources.data.resources.map((resource) => ({
      key: resource.billingAccountName,
      displayKey: `Billing Account = ${resource.billingAccountName}`,
      values: resource.projects.map((project) => ({
        id: project.projectId,
        name: project.projectName,
      })),
    }));
  }, [availableResources]);

  const handleAssignResources = async () => {
    try {
      const projectIds = selectedResources.flatMap((resource) => resource.values);
      await assignResources(
        {
          groupId,
          projectIds,
        },
        {
          onSuccess: () => {
            handleCloseDialog();
            setSelectedResources([]);
            invalidateResourceQueries({
              queryClient,
              platform: PlatformsValue.GCP,
              groupId,
              tierOneGroupId: params.tierOneGroupId,
              tierTwoGroupId: params.tierTwoGroupId,
            });
            popToastWithResource('success');
          },
          onError: (error) => {
            console.error(error);
            popToastWithResource('error');
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    if (isAssignPending) return;
    handleCloseDialogProps();
  };

  return (
    <VStack gap={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{LABELS.title}</Typography>
        <Icon
          name="close"
          sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 24 }}
          onClick={handleCloseDialog}
        />
      </HStack>
      <Typography variant="body1">{LABELS.subtitle}</Typography>
      {isLoadingAvailableResources ? (
        <AssignResourceSelectSkeleton label="Resources" />
      ) : (
        <GroupedMultiSelect
          data={groupedResourcesOption}
          value={selectedResources}
          onChange={setSelectedResources}
          label="Resources"
          selectPlaceholder="Select resources"
          searchPlaceholder="Search resources..."
        />
      )}
      <HStack justifyContent="flex-end" gap={4}>
        <Button
          variant="outlined"
          onClick={handleCloseDialog}
          sx={{ width: '100px' }}
          disabled={isLoadingAvailableResources || isAssignPending}
        >
          {LABELS.cancelButtonLabel}
        </Button>
        <Button
          variant="contained"
          onClick={handleAssignResources}
          sx={{ width: '100px' }}
          disabled={isLoadingAvailableResources || isAssignPending}
          isLoading={isAssignPending}
        >
          {LABELS.assignButtonLabel}
        </Button>
      </HStack>
    </VStack>
  );
}
