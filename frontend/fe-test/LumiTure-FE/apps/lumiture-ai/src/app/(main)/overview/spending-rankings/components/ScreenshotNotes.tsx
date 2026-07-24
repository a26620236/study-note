import type { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';

interface ScreenshotNotesProps {
  sx?: SxProps;
}

export default function ScreenshotNotes({ sx }: ScreenshotNotesProps) {
  return (
    <Typography
      sx={{ p: 1, whiteSpace: 'pre-wrap', ...sx }}
      variant="caption"
      component="p"
      align="center"
      color="text.secondary"
    >
      Please note that LumiTure.ai values may slightly differ from your console
      <br />
      due to variations in cloud provider time zones, currency settings, and the{' '}
      <strong>EXCLUSION OF CREDITS</strong> on this page.
      <br />
      LumiTure.ai aims providing a comprehensive overview of your cloud spending.
      <br />
      We appreciate your understanding and trust in our platform to help you optimize your cloud
      costs.
    </Typography>
  );
}
