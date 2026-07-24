import { useState } from 'react';

import { Button, Icon } from '@lumiture-ui';

import type { GCPAssignedResourcesInfos } from '@hooks-api';

import { useGCPAssignedResourceData } from '../../../hooks/useGCPAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import { GCPResourceRemoveDialog } from '../GCPResourceRemoveDialog/GCPResourceRemoveDialog';

const LABELS = {
  unlinkButton: 'Unlink Resource',
};

export function GCPResourcesRemove() {
  const [isOpenRemoveDialog, setIsOpenRemoveDialog] = useState(false);

  const { gcpAvailableActions, gcpAssignedResourceData } = useGCPAssignedResourceData();
  const resourcesRowSelection = usePlatformResources((state) => state.gcp.resourcesRowSelection);

  const isCanEditResource = gcpAvailableActions?.removeResource ?? false;

  const selectedResources: GCPAssignedResourcesInfos[] = gcpAssignedResourceData.filter(
    (resource) => resourcesRowSelection[resource.projectId]
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
      <GCPResourceRemoveDialog
        removedResources={selectedResources}
        open={isOpenRemoveDialog}
        handleClose={handleCloseRemoveDialog}
      />
    </>
  );
}
