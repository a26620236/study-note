import Typography from '@mui/material/Typography';

import type { InstructionName } from './types';

interface InstructionLinkProps {
  name: InstructionName;
  onClick: (instructionName: InstructionName) => void;
}
export const InstructionLink = ({ name, onClick }: InstructionLinkProps) => (
  <Typography variant="bodyBold" align="center" color="primary.light">
    You may also be interested in: {/*  */}
    <Typography
      variant="bodyBold"
      onClick={() => onClick(name)}
      sx={{ cursor: 'pointer', display: 'inline', textDecoration: 'underline' }}
    >
      {name}
    </Typography>
  </Typography>
);
