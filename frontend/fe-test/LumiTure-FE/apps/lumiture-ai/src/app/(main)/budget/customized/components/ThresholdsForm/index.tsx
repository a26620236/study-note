import React, { useState } from 'react';

import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useFormContext } from 'react-hook-form';

import { FORM_ID, MAXIMUM_THRESHOLDS } from '@app/(main)/budget/customized/components/constants';
import AddThresholdButton from '@app/(main)/budget/customized/components/ThresholdsForm/AddThresholdButton';
import ThresholdInput from '@app/(main)/budget/customized/components/ThresholdsForm/ThresholdInput';
import type { CustomBudgetForm } from '@app/(main)/budget/customized/components/types';

const ThresholdsForm = () => {
  const { setValue, watch } = useFormContext<CustomBudgetForm>();
  const thresholds = watch(FORM_ID.THRESHOLDS);

  const isMaximumThresholds = thresholds.length === MAXIMUM_THRESHOLDS;

  const [autoFocusIndex, setAutoFocusIndex] = useState<number | null>(null);

  const handleAppendThreshold = () => {
    const defaultThreshold = null;
    const newThresholds = [...thresholds, defaultThreshold];
    setValue(FORM_ID.THRESHOLDS, newThresholds);

    setAutoFocusIndex(newThresholds.length - 1);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        borderRadius: '8px',
        bgcolor: 'primary.light10',
      }}
    >
      <Stack direction="row" sx={{ gap: 4, mb: 1 }}>
        <InputLabel required size="small" sx={{ width: 216, m: 0 }}>
          Percent of Budget
        </InputLabel>
        <InputLabel size="small" sx={{ m: 0 }}>
          Amount
        </InputLabel>
      </Stack>

      <ThresholdInput autoFocusIndex={autoFocusIndex} />

      <Tooltip title={isMaximumThresholds && 'You have reached the limit.'} placement="top">
        <Stack sx={{ mr: 'auto', mt: 4 }}>
          <AddThresholdButton onClick={handleAppendThreshold} disabled={isMaximumThresholds} />
        </Stack>
      </Tooltip>
    </Card>
  );
};

export default ThresholdsForm;
