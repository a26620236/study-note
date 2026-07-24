import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import AddThresholdButton from '@app/(main)/budget/customized/components/ThresholdsForm/AddThresholdButton';

export const LoadingField = () => (
  <Stack>
    <Skeleton width="20%" height="12px" sx={{ py: 1.2, mb: 2 }} />
    <Skeleton width="100%" height="36px" />
  </Stack>
);

export const LoadingBudgetSettings = () => (
  <Stack sx={{ gap: 8 }}>
    {new Array(4).fill(true).map((_, i) => (
      <LoadingField key={i} />
    ))}
  </Stack>
);

export const LoadingThresholds = () => (
  <Stack
    bgcolor="gray.disableLight"
    color="text.secondary"
    gap={4}
    sx={{
      borderRadius: '8px',
      border: '1px solid',
      borderColor: 'gray.disableDark',
      p: 4,
      textAlign: 'center',
    }}
  >
    <Stack sx={{ width: '44%' }}>
      <Skeleton width="46%" height="12px" sx={{ py: 1.2, mb: 2 }} />
      <Skeleton width="100%" height="36px" />
    </Stack>
    <AddThresholdButton disabled />
  </Stack>
);
