import { Tooltip, Typography, useTheme } from '@mui/material';

interface NameCellProps {
  name: string;
  id: string | number;
}

export function NameCell({ name, id }: NameCellProps) {
  const theme = useTheme();

  return (
    <Tooltip title={`${name} (${id})`}>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
          maxWidth: '100%',
          flex: 1,
          display: 'inline',
        }}
      >
        {name}
        <Typography
          component="span"
          variant="body2"
          sx={{ color: theme.palette.grey[500], ml: 0.2 }}
        >
          {`(${id})`}
        </Typography>
      </Typography>
    </Tooltip>
  );
}
