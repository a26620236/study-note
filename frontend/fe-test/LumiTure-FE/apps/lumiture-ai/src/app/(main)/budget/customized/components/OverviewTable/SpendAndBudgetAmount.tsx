import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { nFormatter } from '@shared/utils';

interface ProgressThresholds {
  success: number;
  warning: number;
  error: number;
}

const getProgressColor = (
  usagePercent: number,
  thresholds: ProgressThresholds = { success: 0, warning: 60, error: 100 }
) => {
  if (usagePercent >= thresholds.error) return 'error.main';
  if (usagePercent >= thresholds.warning) return 'warning.hover';
  return 'success.main';
};

const SpendAndBudgetAmount = ({ spending, budget }: { spending: number; budget: number }) => {
  const formattedSpending = nFormatter({ num: spending, fixed: 2, prefix: 'USD ' });
  const formattedBudget = nFormatter({ num: budget, fixed: 2 });

  const usagePercent = Math.min((spending / budget) * 100, 100);
  const progressColor = getProgressColor(usagePercent);

  return (
    <Stack direction="row" alignItems="center" spacing={4}>
      <Stack
        direction="row"
        sx={{
          position: 'relative',
          width: 120,
          height: 16,
          borderRadius: '4px',
          overflow: 'hidden',
          bgcolor: '#E6E6E6',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `repeating-linear-gradient(to right, transparent 0%,
              transparent 19%, #fff 19%, #fff 21%, transparent 21%,
              transparent 39%, #fff 39%, #fff 41%, transparent 41%,
              transparent 59%, #fff 59%, #fff 61%, transparent 61%,
              transparent 79%, #fff 79%, #fff 81%, transparent 81%,
              transparent 100%)`,
          },
        }}
      >
        <Box
          sx={{
            width: `${usagePercent}%`,
            bgcolor: progressColor,
            borderRadius: '4px',
          }}
        />
      </Stack>

      <Typography variant="caption">
        {formattedSpending} / {formattedBudget}
      </Typography>
    </Stack>
  );
};

export default SpendAndBudgetAmount;
