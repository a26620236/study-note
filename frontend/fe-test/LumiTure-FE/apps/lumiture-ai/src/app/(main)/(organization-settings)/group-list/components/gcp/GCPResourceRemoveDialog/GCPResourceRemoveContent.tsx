import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import {
  useCheckGCPResource,
  useDeleteGCPResources,
  type GCPAssignedResourcesInfos,
} from '@hooks-api';

import { useGCPAssignedResourceData } from '../../../hooks/useGCPAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import type { TierOneAndTwoGroupParams } from '../../../types/params';
import { invalidateResourceQueries } from '../../../utils/invalidateResourceQueries';
import { popToastWithResource } from '../../../utils/popToastWithResource';
import type { UnlinkResourceInfos } from '../../UnlinkResourceWarningContent';

const LABELS = {
  title: 'Unlink Resource',
  description: 'Do you confirm that you want to unlink this resource from',
  cancelButtonLabel: 'Cancel',
  unlinkButtonLabel: 'Unlink',
};

interface GCPResourceRemoveContentProps {
  removedResources: GCPAssignedResourcesInfos[];
  handleCloseDialog: () => void;
  handleCheckResources: (data: UnlinkResourceInfos[]) => void;
}

export function GCPResourceRemoveContent({
  removedResources,
  handleCloseDialog: handleCloseDialogProps,
  handleCheckResources,
}: GCPResourceRemoveContentProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const params = useParams<TierOneAndTwoGroupParams>();
  const isTierTwoGroup = !!params.tierTwoGroupId;
  const { groupId } = useGCPAssignedResourceData();
  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);
  const { mutateAsync: checkResources, isPending: isCheckPending } = useCheckGCPResource();
  const { mutateAsync: deleteResources, isPending: isDeletePending } = useDeleteGCPResources({
    onSuccess: () => {
      invalidateResourceQueries({
        queryClient,
        platform: PlatformsValue.GCP,
        groupId,
        tierOneGroupId: params.tierOneGroupId,
        tierTwoGroupId: params.tierTwoGroupId,
      });
      setResourcesRowSelection(PlatformsValue.GCP, {});
      popToastWithResource('success');
    },
    onError: () => {
      popToastWithResource('error');
    },
  });

  const handleRemoveResource = async () => {
    const removedProjectIds = removedResources.map((resource) => resource.projectId);
    if (!groupId || removedProjectIds.length === 0) return;

    const payload = {
      groupId,
      projectIds: removedProjectIds,
    };

    try {
      // TierTwoGroup 不需要檢查，直接刪除
      if (isTierTwoGroup) {
        await deleteResources(payload);
        handleCloseDialogProps();
        return;
      }
      // 檢查是否有需要 unlink 的資源
      const checkResult = await checkResources(payload);
      const unlinkData = checkResult.data.resources;

      if (unlinkData.length > 0) {
        // 有需要 unlink 的資源，轉換資料格式並通知父層
        const unlinkResourceInfos: UnlinkResourceInfos[] = unlinkData.map((resource) => ({
          id: resource.projectId,
          name: resource.projectName,
          groups: resource.groups,
        }));
        handleCheckResources(unlinkResourceInfos);
        return;
      }
      // 沒有需要 unlink 的資源，直接刪除
      await deleteResources(payload);
      handleCloseDialogProps();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    if (isCheckPending || isDeletePending) return;
    handleCloseDialogProps();
  };

  return (
    <VStack gap={8}>
      <HStack justifyContent="space-between" alignItems="center">
        <HStack alignItems="center" gap={4}>
          <Icon name="warning" sx={{ color: 'text.secondary', fontSize: 24 }} />
          <Typography variant="h4">{LABELS.title}</Typography>
        </HStack>
        <Icon
          name="close"
          sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 24 }}
          onClick={handleCloseDialog}
        />
      </HStack>
      <VStack gap={2}>
        <Typography variant="body1">{LABELS.description}</Typography>
        <Box
          sx={{
            border: `1px solid ${theme.palette.gray.borderLight}`,
            borderRadius: 2,
            maxHeight: '300px',
            overflow: 'auto',
            p: 2,
            pl: 8,
          }}
          component="ul"
        >
          {removedResources.map((resource) => (
            <Typography
              key={resource.projectId}
              variant="body1"
              color="primary"
              sx={{ fontWeight: 'bold', display: 'list-item' }}
              component="li"
            >
              {resource.projectName}
            </Typography>
          ))}
        </Box>
      </VStack>
      <HStack justifyContent="flex-end" gap={4}>
        <Button
          variant="outlined"
          onClick={handleCloseDialog}
          sx={{ width: '100px' }}
          disabled={isCheckPending || isDeletePending}
        >
          {LABELS.cancelButtonLabel}
        </Button>
        <Button
          variant="contained"
          onClick={handleRemoveResource}
          disabled={isCheckPending || isDeletePending}
          sx={{ width: '100px' }}
          isLoading={isCheckPending || isDeletePending}
        >
          {LABELS.unlinkButtonLabel}
        </Button>
      </HStack>
    </VStack>
  );
}
