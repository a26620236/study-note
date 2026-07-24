import { Chip } from '@mui/material';

import { theme } from '@lumiture-ui/theme';

const CHIP_BASIC_STYLE = {
  borderRadius: '4px',
  padding: '0 8px',
  height: 'fit-content',
  color: theme.palette.white.main,
  '& .MuiChip-label': {
    padding: 0,
  },
};

const LABELS = {
  completed: 'Completed',
  incomplete: 'Incomplete',
};

export function CompletionChip({ completed }: { completed: boolean }) {
  return (
    <Chip
      label={completed ? LABELS.completed : LABELS.incomplete}
      sx={{
        ...CHIP_BASIC_STYLE,
        backgroundColor: completed ? theme.palette.success.main : theme.palette.error.main,
      }}
    />
  );
}
