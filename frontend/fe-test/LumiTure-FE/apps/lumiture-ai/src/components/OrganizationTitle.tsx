'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface TitleProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
}

const OrganizationTitle = ({ title, subTitle }: TitleProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ flexShrink: 0, mb: theme.spacing(4) }}>
      <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        {subTitle}
      </Typography>
    </Box>
  );
};

export default OrganizationTitle;
