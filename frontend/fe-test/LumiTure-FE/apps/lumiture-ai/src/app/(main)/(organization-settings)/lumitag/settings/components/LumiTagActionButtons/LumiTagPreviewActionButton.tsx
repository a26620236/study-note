'use client';

import { useState } from 'react';

import Button from '@mui/material/Button';
import { useFormContext } from 'react-hook-form';

import { HStack, Icon } from '@lumiture-ui';

import { BOTTOM_BAR_HEIGHT, FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import { useGetLumiTagPreviewOverview } from '@hooks-api';

import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { LumiTagSaveAsActiveDialog } from './LumiTagSaveAsActiveDialog';
import { LumiTagSaveAsInactiveDialog } from './LumiTagSaveAsInactiveDialog';

const LABELS = {
  backToEdit: 'Back to Edit',
  saveInactive: 'Save as Inactive Tag',
  applyLumiTag: 'Apply LumiTag',
} as const;

interface LumiTagPreviewActionButtonProps {
  onBack: () => void;
  onSaveInactive: () => void;
  onSaveActive: () => void;
  isSaving: boolean;
}

export function LumiTagPreviewActionButton({
  onBack,
  onSaveInactive,
  onSaveActive,
  isSaving,
}: LumiTagPreviewActionButtonProps) {
  const { getValues } = useFormContext<LumiTagFormData>();
  const payload = getValues();
  const { data: overviewRes } = useGetLumiTagPreviewOverview(payload);
  const [saveAsActiveDialogOpen, setSaveAsActiveDialogOpen] = useState(false);
  const [saveAsInactiveDialogOpen, setSaveAsInactiveDialogOpen] = useState(false);

  const tagName = payload.name;
  const overviewData = overviewRes?.data ?? { totalCost: 0, values: [] };

  return (
    <>
      <FixedBottomBarWrapper>
        <Button
          onClick={onBack}
          variant="outlined"
          disabled={isSaving}
          startIcon={<Icon name="arrow_circle_left" />}
          sx={{ height: `${BOTTOM_BAR_HEIGHT - 28}px` }}
        >
          {LABELS.backToEdit}
        </Button>
        <HStack sx={{ gap: 2, marginLeft: 'auto' }}>
          <Button
            variant="outlined"
            onClick={() => setSaveAsInactiveDialogOpen(true)}
            disabled={isSaving}
          >
            {LABELS.saveInactive}
          </Button>
          <Button
            variant="contained"
            onClick={() => setSaveAsActiveDialogOpen(true)}
            disabled={isSaving}
          >
            {LABELS.applyLumiTag}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
      <LumiTagSaveAsInactiveDialog
        open={saveAsInactiveDialogOpen}
        onClose={() => setSaveAsInactiveDialogOpen(false)}
        onConfirm={() => {
          setSaveAsInactiveDialogOpen(false);
          onSaveInactive();
        }}
        isSaving={isSaving}
      />
      <LumiTagSaveAsActiveDialog
        isSaving={isSaving}
        open={saveAsActiveDialogOpen}
        tagName={tagName}
        overviewData={overviewData}
        onClose={() => setSaveAsActiveDialogOpen(false)}
        onConfirm={() => onSaveActive()}
      />
    </>
  );
}
