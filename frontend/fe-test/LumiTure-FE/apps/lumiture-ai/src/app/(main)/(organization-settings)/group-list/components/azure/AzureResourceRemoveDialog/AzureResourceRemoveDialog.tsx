import { useState } from 'react';
import { useParams } from 'next/navigation';

import { Dialog } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { PlatformsValue } from '@constants';
import { useDeleteAzureResources, type AzureAssignedResourcesInfos } from '@hooks-api';

import { useAzureAssignedResourceData } from '../../../hooks/useAzureAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import type { TierOneAndTwoGroupParams } from '../../../types/params';
import { invalidateResourceQueries } from '../../../utils/invalidateResourceQueries';
import { popToastWithResource } from '../../../utils/popToastWithResource';
import {
  UnlinkResourceWarningContent,
  type UnlinkResourceInfos,
} from '../../UnlinkResourceWarningContent';
import { AzureResourceRemoveContent } from './AzureResourceRemoveContent';

interface AzureResourceRemoveDialogProps {
  removedResources: AzureAssignedResourcesInfos[];
  open: boolean;
  handleClose: () => void;
}

export function AzureResourceRemoveDialog({
  removedResources,
  open,
  handleClose,
}: AzureResourceRemoveDialogProps) {
  const queryClient = useQueryClient();
  const params = useParams<TierOneAndTwoGroupParams>();
  const { groupId } = useAzureAssignedResourceData();

  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);

  const [step, setStep] = useState<'first' | 'second'>('first');
  const [unlinkResources, setUnlinkResources] = useState<UnlinkResourceInfos[]>([]);

  const { mutateAsync: deleteResources, isPending: isDeletePending } = useDeleteAzureResources();

  const handleCloseDialog = () => {
    handleClose();
    setStep('first');
    setUnlinkResources([]);
  };

  const handleCheckResources = (data: UnlinkResourceInfos[]) => {
    setUnlinkResources(data);
    setStep('second');
  };

  const handleUnlinkResources = async () => {
    const removedResourceGroupIds = removedResources.map((resource) => resource.resourceGroupId);
    if (!groupId || removedResourceGroupIds.length === 0) return;

    try {
      await deleteResources(
        {
          groupId,
          resourceGroupIds: removedResourceGroupIds,
        },
        {
          onSuccess: () => {
            invalidateResourceQueries({
              queryClient,
              platform: PlatformsValue.AZURE,
              groupId,
              tierOneGroupId: params.tierOneGroupId,
              tierTwoGroupId: params.tierTwoGroupId,
            });
            setResourcesRowSelection(PlatformsValue.AZURE, {});
            popToastWithResource('success');
            handleCloseDialog();
          },
          onError: () => {
            popToastWithResource('error');
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      hideBackdrop={false}
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          p: '24px 32px',
        },
      }}
    >
      {step === 'first' && (
        <AzureResourceRemoveContent
          removedResources={removedResources}
          handleCloseDialog={handleCloseDialog}
          handleCheckResources={handleCheckResources}
        />
      )}
      {step === 'second' && (
        <UnlinkResourceWarningContent
          isPending={isDeletePending}
          unlinkResources={unlinkResources}
          handleCloseDialog={handleCloseDialog}
          handlePreviousStep={() => setStep('first')}
          handleUnlinkResources={handleUnlinkResources}
        />
      )}
    </Dialog>
  );
}
