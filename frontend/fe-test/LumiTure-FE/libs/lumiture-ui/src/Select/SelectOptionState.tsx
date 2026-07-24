import { CircularProgress, Stack, Typography } from '@mui/material';

export function LoadingState() {
  return (
    <Stack sx={{ py: 4 }}>
      <CircularProgress size={40} sx={{ m: 'auto' }} />
    </Stack>
  );
}

const LABELS = {
  message: 'No options',
};

export function EmptyState() {
  return (
    <Typography color="text.hint" sx={{ m: 2.5 }}>
      {LABELS.message}
    </Typography>
  );
}
