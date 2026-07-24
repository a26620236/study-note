'use client';

import { useSearchParams } from 'next/navigation';

import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';

const LABELS = {
  goBack: 'LumiTag List',
  createTitle: 'Create LumiTag',
  editTitle: 'Edit LumiTag',
  subtitle: 'Define a tag key name and add values with conditions to auto-assign resources.',
};

export function LumiTagSettingsToolbar() {
  const searchParams = useSearchParams();
  const tagId = searchParams.get('tagId');

  return (
    <VStack sx={{ gap: 0 }}>
      <GoBack
        content={LABELS.goBack}
        url="/lumitag"
        sx={{ justifyContent: 'flex-start', width: 'fit-content' }}
      />
      <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
        {tagId ? LABELS.editTitle : LABELS.createTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {LABELS.subtitle}
      </Typography>
    </VStack>
  );
}
