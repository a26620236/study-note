import { useState } from 'react';

import { Button, HStack, Icon } from '@lumiture-ui';

import { RightsizingDialogDismiss } from '../RightsizingDialogDismiss/RightsizingDialogDismiss';

const LABELS = {
  buttonText: 'Dismiss',
  description: 'The items will be transferred to "Dismiss"',
};

export function DismissActionButton() {
  const [open, setOpen] = useState(false);

  const handleDismiss = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleDismiss}
        tooltipProps={{
          title: LABELS.description,
          placement: 'top',
        }}
      >
        <HStack gap={1} alignItems="center">
          <Icon name="overview" sx={{ fontSize: 16 }} />
          {LABELS.buttonText}
        </HStack>
      </Button>
      <RightsizingDialogDismiss open={open} onClose={() => setOpen(false)} />
    </>
  );
}
