import type { ButtonProps } from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Button, Icon } from '@lumiture-ui';

const AddThresholdButton = (props: ButtonProps) => (
  <Button
    variant="text"
    startIcon={<Icon name="add_circle" />}
    sx={{ mr: 'auto', '&.Mui-disabled': { bgcolor: 'unset' } }}
    {...props}
  >
    <Typography variant="bodyBold">Add Threshold</Typography>
  </Button>
);

export default AddThresholdButton;
