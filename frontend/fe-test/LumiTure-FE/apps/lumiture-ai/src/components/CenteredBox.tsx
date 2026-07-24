import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const CenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%',
  rowGap: theme.spacing(2),
}));

export default CenteredBox;
