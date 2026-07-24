import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const EmptyRule = () => (
  <Stack
    bgcolor="background.page"
    color="text.secondary"
    gap={2}
    sx={{
      borderRadius: '8px',
      border: '1px dashed',
      borderColor: 'text.secondary',
      py: 8,
      textAlign: 'center',
    }}
  >
    <Typography variant="h6">No Rule Added</Typography>
    <Typography>Add rule and rule condition to define the Budget Settings.</Typography>
  </Stack>
);

export const LoadingRule = () => (
  <Stack
    bgcolor="gray.disableLight"
    color="text.secondary"
    gap={2}
    sx={{
      borderRadius: '8px',
      border: '1px solid',
      borderColor: 'gray.disableDark',
      p: 4,
      textAlign: 'center',
    }}
  >
    <Skeleton width="40%" height="14px" sx={{ py: 1.2, mb: 3 }} />
    <Skeleton width="70%" height="14px" sx={{ py: 1.2 }} />
  </Stack>
);
