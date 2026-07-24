import { useState } from 'react';

import { Dialog } from '@mui/material';

import { Button, Icon, type SelectedData } from '@lumiture-ui';

import { useAzureAssignedResourceData } from '../../../hooks/useAzureAssignedResourceData';
import { AzureAssignResourcesContent } from './AzureAssignResourcesContent';

const LABELS = {
  buttonLabel: 'Assign Resource',
};

export function AzureAssignResources() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<SelectedData>([]);

  const { azureAvailableActions } = useAzureAssignedResourceData();
  const isCanAssignResource = azureAvailableActions?.assignResource;

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedResources([]);
  };

  return (
    <>
      {isCanAssignResource && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon name="add" />}
          onClick={handleOpenDialog}
          data-testid="assign-resource-button"
        >
          {LABELS.buttonLabel}
        </Button>
      )}
      <Dialog
        open={isOpen}
        disableEscapeKeyDown
        hideBackdrop={false}
        disableRestoreFocus
        sx={{
          '& .MuiDialog-paper': {
            p: '24px 32px',
            minWidth: 800,
          },
        }}
      >
        <AzureAssignResourcesContent
          selectedResources={selectedResources}
          setSelectedResources={setSelectedResources}
          handleCloseDialog={handleCloseDialog}
        />
      </Dialog>
    </>
  );
}
