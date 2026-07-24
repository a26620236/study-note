import { Tooltip, Typography } from '@mui/material';

const LABELS = {
  tooltip:
    'According to the status of cloud platform’s data, the usage data for the current day may be available only on the next day and may differ from actual usage. Accurate cost information is typically available approximately 48 hours after the usage is generated.',
};

export const RightsizingInfoBannerDescription = () => (
  <Typography variant="caption" color="text.secondary">
    Optimize cloud resources and track savings. Please note that LumiTure.ai values may slightly
    differ from your console
    <br />
    due to variations in cloud provider time zones, currency settings, and the{' '}
    <strong>EXCLUSION OF CREDITS</strong> on this page. (
    <Tooltip title={LABELS.tooltip}>
      <Typography variant="caption" sx={{ textDecoration: 'underline' }}>
        Learn More
      </Typography>
    </Tooltip>
    )
  </Typography>
);
