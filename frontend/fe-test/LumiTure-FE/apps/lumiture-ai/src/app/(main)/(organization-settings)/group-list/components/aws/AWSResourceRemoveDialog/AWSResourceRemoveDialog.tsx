import { useState } from 'react';
import { useParams } from 'next/navigation';

import { Dialog } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { PlatformsValue } from '@constants';
import { useDeleteAWSResources, type AWSAssignedResourcesInfos } from '@hooks-api';

import { useAWSAssignedResourceData } from '../../../hooks/useAWSAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import type { TierOneAndTwoGroupParams } from '../../../types/params';
import { invalidateResourceQueries } from '../../../utils/invalidateResourceQueries';
import { popToastWithResource } from '../../../utils/popToastWithResource';
import {
  UnlinkResourceWarningContent,
  type UnlinkResourceInfos,
} from '../../UnlinkResourceWarningContent';
import { AWSResourceRemoveContent } from './AWSResourceRemoveContent';

interface AWSResourceRemoveDialogProps {
  removedResources: AWSAssignedResourcesInfos[];
  open: boolean;
  handleClose: () => void;
}

export function AWSResourceRemoveDialog({
  removedResources,
  open,
  handleClose,
}: AWSResourceRemoveDialogProps) {
  const queryClient = useQueryClient();
  const params = useParams<TierOneAndTwoGroupParams>();
  const { groupId } = useAWSAssignedResourceData();

  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);

  const [step, setStep] = useState<'first' | 'second'>('first');
  const [unlinkResources, setUnlinkResources] = useState<UnlinkResourceInfos[]>([]);

  const { mutateAsync: deleteResources, isPending: isDeletePending } = useDeleteAWSResources();

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
    const removedAccountIds = removedResources.map((resource) => resource.accountId);
    if (!groupId || removedAccountIds.length === 0) return;

    try {
      await deleteResources(
        {
          groupId,
          accountIds: removedAccountIds,
        },
        {
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
        <AWSResourceRemoveContent
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
