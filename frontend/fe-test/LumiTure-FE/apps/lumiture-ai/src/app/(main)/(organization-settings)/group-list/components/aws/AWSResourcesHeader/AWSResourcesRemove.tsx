import { useState } from 'react';

import { Button, Icon } from '@lumiture-ui';

import type { AWSAssignedResourcesInfos } from '@hooks-api';

import { useAWSAssignedResourceData } from '../../../hooks/useAWSAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import { AWSResourceRemoveDialog } from '../AWSResourceRemoveDialog/AWSResourceRemoveDialog';

const LABELS = {
  unlinkButton: 'Unlink Resource',
};

export function AWSResourcesRemove() {
  const [isOpenRemoveDialog, setIsOpenRemoveDialog] = useState(false);

  const { awsAvailableActions, awsAssignedResourceData } = useAWSAssignedResourceData();
  const resourcesRowSelection = usePlatformResources((state) => state.aws.resourcesRowSelection);

  const isCanEditResource = awsAvailableActions?.removeResource ?? false;

  const selectedResources: AWSAssignedResourcesInfos[] = awsAssignedResourceData.filter(
    (resource) => resourcesRowSelection[resource.accountId]
  );

  const hasSelectedResources = selectedResources.length > 0;

  const handleOpenRemoveDialog = () => {
    setIsOpenRemoveDialog(true);
  };

  const handleCloseRemoveDialog = () => {
    setIsOpenRemoveDialog(false);
  };

  if (!isCanEditResource || !hasSelectedResources) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenRemoveDialog}
        startIcon={<Icon name="link_off" />}
      >
        {LABELS.unlinkButton}
      </Button>
      <AWSResourceRemoveDialog
        removedResources={selectedResources}
        open={isOpenRemoveDialog}
        handleClose={handleCloseRemoveDialog}
      />
    </>
  );
}
