import { useState } from 'react';

import { Button, Icon } from '@lumiture-ui';

import type { AzureAssignedResourcesInfos } from '@hooks-api';

import { useAzureAssignedResourceData } from '../../../hooks/useAzureAssignedResourceData';
import { usePlatformResources } from '../../../hooks/usePlatformResources';
import { AzureResourceRemoveDialog } from '../AzureResourceRemoveDialog/AzureResourceRemoveDialog';

const LABELS = {
  unlinkButton: 'Unlink Resource',
};

export function AzureResourcesRemove() {
  const [isOpenRemoveDialog, setIsOpenRemoveDialog] = useState(false);

  const { azureAvailableActions, azureAssignedResourceData } = useAzureAssignedResourceData();
  const resourcesRowSelection = usePlatformResources((state) => state.azure.resourcesRowSelection);

  const isCanEditResource = azureAvailableActions?.removeResource ?? false;

  const selectedResources: AzureAssignedResourcesInfos[] = azureAssignedResourceData.filter(
    (resource) => resourcesRowSelection[resource.resourceGroupId]
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
      <AzureResourceRemoveDialog
        removedResources={selectedResources}
        open={isOpenRemoveDialog}
        handleClose={handleCloseRemoveDialog}
      />
    </>
  );
}
