import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface EmailProps {
  sx?: SxProps;
}

const Email = ({ sx }: EmailProps) => (
  <Typography
    component="a"
    href="mailto:support@lumiture.ai"
    target="_blank"
    sx={{ color: 'primary.main', ...sx }}
  >
    support@lumiture.ai
  </Typography>
);

export default Email;
