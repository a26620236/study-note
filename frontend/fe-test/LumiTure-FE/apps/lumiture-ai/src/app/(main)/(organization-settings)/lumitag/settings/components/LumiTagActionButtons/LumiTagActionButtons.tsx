'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, HStack } from '@lumiture-ui';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';

import { LumiTagSaveAsInactiveDialog } from './LumiTagSaveAsInactiveDialog';

interface LumiTagActionButtonsProps {
  onPreview: () => void;
  onValidate: (onValid: () => void) => void;
  onSaveInactive: () => void;
  isSaving: boolean;
}

const LABELS = {
  cancel: 'Cancel',
  saveAsInactive: 'Save as Inactive Tag',
  coveragePreview: 'Coverage Preview',
} as const;

export function LumiTagActionButtons({
  onPreview,
  onValidate,
  onSaveInactive,
  isSaving,
}: LumiTagActionButtonsProps) {
  const router = useRouter();

  const [isInactiveDialogOpen, setIsInactiveDialogOpen] = useState(false);

  function handleSaveAsInactive() {
    onValidate(() => setIsInactiveDialogOpen(true));
  }

  return (
    <>
      <FixedBottomBarWrapper>
        <HStack sx={{ gap: 2, width: '100%', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={isSaving}
            data-testid="lumiTag-cancel-button"
          >
            {LABELS.cancel}
          </Button>
          <HStack sx={{ gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSaveAsInactive}
              disabled={isSaving}
              isLoading={isSaving}
              data-testid="lumiTag-save-button"
            >
              {LABELS.saveAsInactive}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onPreview}
              disabled={isSaving}
              data-testid="lumiTag-preview-button"
            >
              {LABELS.coveragePreview}
            </Button>
          </HStack>
        </HStack>
      </FixedBottomBarWrapper>
      <LumiTagSaveAsInactiveDialog
        open={isInactiveDialogOpen}
        onClose={() => setIsInactiveDialogOpen(false)}
        onConfirm={() => onSaveInactive()}
        isSaving={isSaving}
      />
    </>
  );
}
