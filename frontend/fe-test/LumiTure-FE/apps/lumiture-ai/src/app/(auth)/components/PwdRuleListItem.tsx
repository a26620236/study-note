import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface PwdRuleListItemProps {
  text: string;
}

export default function PwdRuleListItem({ text }: PwdRuleListItemProps) {
  return (
    <ListItem sx={{ cursor: 'unset !important', '&:hover': { backgroundColor: 'unset' } }}>
      <Typography sx={{ mr: 2 }}>•</Typography>
      <ListItemText primary={text} slotProps={{ primary: { variant: 'caption' } }} />
    </ListItem>
  );
}
