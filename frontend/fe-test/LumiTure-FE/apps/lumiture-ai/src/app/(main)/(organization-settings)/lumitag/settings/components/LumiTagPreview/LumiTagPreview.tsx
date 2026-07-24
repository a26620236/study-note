'use client';

import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import { BOTTOM_BAR_HEIGHT } from '@components/layout/FixedBottomBarWrapper';

import { LumiTagPreviewChart } from '../LumiTagPreviewChart/LumiTagPreviewChart';
import { LumiTagPreviewTable } from './LumiTagPreviewTable';

const LABELS = {
  goBackContent: 'LumiTag List',
  title: 'Coverage Preview',
};

export function LumiTagPreview() {
  return (
    <VStack sx={{ gap: 4, pb: `${BOTTOM_BAR_HEIGHT + 24}px` }}>
      <GoBack
        content={LABELS.goBackContent}
        url="/lumitag"
        sx={{ justifyContent: 'flex-start', width: 'fit-content' }}
      />
      <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
        {LABELS.title}
      </Typography>
      <LumiTagPreviewChart />
      <LumiTagPreviewTable />
    </VStack>
  );
}
