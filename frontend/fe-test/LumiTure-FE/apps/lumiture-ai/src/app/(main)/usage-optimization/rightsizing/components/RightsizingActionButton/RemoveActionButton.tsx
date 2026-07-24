import { useState } from 'react';

import { Button, HStack, Icon } from '@lumiture-ui';

import { RightsizingDialogRemove } from '../RightsizingDialogRemove/RightsizingDialogRemove';

const LABELS = {
  buttonText: 'Remove',
  description: 'The items will be permanently removed.',
};

export function RemoveActionButton() {
  const [open, setOpen] = useState(false);

  const handleRemove = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleRemove}
        tooltipProps={{
          title: LABELS.description,
          placement: 'top',
        }}
      >
        <HStack gap={1} alignItems="center">
          <Icon name="delete" sx={{ fontSize: 16 }} />
          {LABELS.buttonText}
        </HStack>
      </Button>
      <RightsizingDialogRemove open={open} onClose={() => setOpen(false)} />
    </>
  );
}
