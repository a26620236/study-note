import { useState } from 'react';
import { useParams } from 'next/navigation';

import { Dialog } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { PlatformsValue } from '@constants';
import { useDeleteGCPResources, type GCPAssignedResourcesInfos } from '@hooks-api';

import { useGCPAssignedResourceData } from '../../../hooks/useGCPAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import type { TierOneAndTwoGroupParams } from '../../../types/params';
import { invalidateResourceQueries } from '../../../utils/invalidateResourceQueries';
import { popToastWithResource } from '../../../utils/popToastWithResource';
import {
  UnlinkResourceWarningContent,
  type UnlinkResourceInfos,
} from '../../UnlinkResourceWarningContent';
import { GCPResourceRemoveContent } from './GCPResourceRemoveContent';

interface GCPResourceRemoveDialogProps {
  removedResources: GCPAssignedResourcesInfos[];
  open: boolean;
  handleClose: () => void;
}

export function GCPResourceRemoveDialog({
  removedResources,
  open,
  handleClose,
}: GCPResourceRemoveDialogProps) {
  const queryClient = useQueryClient();
  const params = useParams<TierOneAndTwoGroupParams>();
  const { groupId } = useGCPAssignedResourceData();

  const setResourcesRowSelection = usePlatformResources((state) => state.setResourcesRowSelection);

  const [step, setStep] = useState<'first' | 'second'>('first');
  const [unlinkResources, setUnlinkResources] = useState<UnlinkResourceInfos[]>([]);

  const { mutateAsync: deleteResources, isPending: isDeletePending } = useDeleteGCPResources();

  const handleCloseDialog = () => {
    if (isDeletePending) return;
    handleClose();
    setStep('first');
    setUnlinkResources([]);
  };

  const handleCheckResources = (data: UnlinkResourceInfos[]) => {
    setUnlinkResources(data);
    setStep('second');
  };

  const handleUnlinkResources = async () => {
    const removedProjectIds = removedResources.map((resource) => resource.projectId);
    if (!groupId || removedProjectIds.length === 0) return;

    try {
      await deleteResources(
        {
          groupId,
          projectIds: removedProjectIds,
        },
        {
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
        <GCPResourceRemoveContent
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
