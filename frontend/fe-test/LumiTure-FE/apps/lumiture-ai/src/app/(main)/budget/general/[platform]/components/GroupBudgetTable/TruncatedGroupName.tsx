import { Tooltip, Typography } from '@mui/material';

interface TruncatedGroupNameProps {
  name: string;
}

export const TruncatedGroupName = ({ name }: TruncatedGroupNameProps) => (
  <Tooltip title={name}>
    <Typography
      variant="buttonRegular1"
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
    </Typography>
  </Tooltip>
);
