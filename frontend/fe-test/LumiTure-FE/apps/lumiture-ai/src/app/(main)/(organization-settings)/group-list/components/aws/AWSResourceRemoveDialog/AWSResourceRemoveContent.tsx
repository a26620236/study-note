import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import {
  useCheckAWSResource,
  useDeleteAWSResources,
  type AWSAssignedResourcesInfos,
} from '@hooks-api';

import { useAWSAssignedResourceData } from '../../../hooks/useAWSAssignedResourceData';
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

interface AWSResourceRemoveContentProps {
  removedResources: AWSAssignedResourcesInfos[];
  handleCloseDialog: () => void;
  handleCheckResources: (data: UnlinkResourceInfos[]) => void;
}

export function AWSResourceRemoveContent({
  removedResources,
  handleCloseDialog: handleCloseDialogProps,
  handleCheckResources,
}: AWSResourceRemoveContentProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const params = useParams<TierOneAndTwoGroupParams>();
  const isTierTwoGroup = !!params.tierTwoGroupId;
  const { groupId } = useAWSAssignedResourceData();
  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);
  const { mutateAsync: checkResources, isPending: isCheckPending } = useCheckAWSResource();
  const { mutateAsync: deleteResources, isPending: isDeletePending } = useDeleteAWSResources({
    onSuccess: () => {
      invalidateResourceQueries({
        queryClient,
        platform: PlatformsValue.AWS,
        groupId,
        tierOneGroupId: params.tierOneGroupId,
        tierTwoGroupId: params.tierTwoGroupId,
      });
      setResourcesRowSelection(PlatformsValue.AWS, {});
      popToastWithResource('success');
    },
    onError: () => {
      popToastWithResource('error');
    },
  });

  const handleRemoveResource = async () => {
    const removedAccountIds = removedResources.map((resource) => resource.accountId);
    if (!groupId || removedAccountIds.length === 0) return;

    const payload = {
      groupId,
      accountIds: removedAccountIds,
    };

    try {
      // TierTwoGroup 不需要檢查,直接刪除
      if (isTierTwoGroup) {
        await deleteResources(payload);
        handleCloseDialogProps();
        return;
      }
      // 檢查是否有需要 unlink 的資源
      const checkResult = await checkResources(payload);
      const unlinkData = checkResult.data.resources;

      if (unlinkData.length > 0) {
        // 有需要 unlink 的資源,轉換資料格式並通知父層
        const unlinkResourceInfos: UnlinkResourceInfos[] = unlinkData.map((resource) => ({
          id: resource.accountId,
          name: resource.accountName,
          groups: resource.groups,
        }));
        handleCheckResources(unlinkResourceInfos);
        return;
      }
      // 沒有需要 unlink 的資源,直接刪除
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
              key={resource.accountId}
              variant="body1"
              color="primary"
              sx={{ fontWeight: 'bold', display: 'list-item' }}
              component="li"
            >
              {resource.accountName}
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
          isLoading={isCheckPending || isDeletePending}
          sx={{ width: '100px' }}
        >
          {LABELS.unlinkButtonLabel}
        </Button>
      </HStack>
    </VStack>
  );
}
