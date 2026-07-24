'use client';

import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Icon } from '@lumiture-ui';
import { useToggle } from '@shared/hooks';

import { InstructionModal } from './InstructionModal';
import type { InstructionName } from './types';

interface InstructionButtonProps {
  name: InstructionName;
  sx?: SxProps;
}
export const InstructionButton = ({ name, sx }: InstructionButtonProps) => {
  const [isOpen, { handleOpen, handleClose }] = useToggle();
  return (
    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary" sx={sx}>
      <Icon name="help" sx={{ fontSize: 14 }} />
      <Typography
        variant="captionBold"
        onClick={handleOpen}
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
      >
        Learn More About {name}
      </Typography>
      <InstructionModal name={name} isOpen={isOpen} onClose={handleClose} />
    </Stack>
  );
};
