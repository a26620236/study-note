import { Tooltip, Typography, useTheme } from '@mui/material';

interface StatusCellProps {
  label: string;
  tooltipText?: string;
  hasError?: boolean;
}

export function StatusCell({ label, tooltipText, hasError = false }: StatusCellProps) {
  const theme = useTheme();
  const color = hasError ? theme.palette.error.main : theme.palette.text.primary;

  return (
    <Tooltip title={tooltipText}>
      <Typography variant="body2" sx={{ color }}>
        {label}
      </Typography>
    </Tooltip>
  );
}
