import { useState } from 'react';

import { Dialog } from '@mui/material';

import { Button, Icon, type SelectedData } from '@lumiture-ui';

import { useAWSAssignedResourceData } from '../../../hooks/useAWSAssignedResourceData';
import { AWSAssignResourcesContent } from './AWSAssignResourcesContent';

const LABELS = {
  buttonLabel: 'Assign Resource',
};

export function AWSAssignResources() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<SelectedData>([]);

  const { awsAvailableActions } = useAWSAssignedResourceData();
  const isCanAssignResource = awsAvailableActions?.assignResource;

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
        <AWSAssignResourcesContent
          selectedResources={selectedResources}
          setSelectedResources={setSelectedResources}
          handleCloseDialog={handleCloseDialog}
        />
      </Dialog>
    </>
  );
}
