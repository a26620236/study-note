import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CenteredBox from '@components/CenteredBox';
import Logo from '@components/Logo';

interface PaperProps {
  children?: React.ReactNode;
  title?: string;
  desc?: string;
  isLoading?: boolean;
  isError?: boolean;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export default function AuthFormWrapper({
  children,
  title,
  desc,
  isLoading,
  isError = false,
  variant = 'elevation',
  elevation = 24,
  onSubmit,
}: PaperProps) {
  return (
    <Paper
      component="form"
      noValidate
      method="post"
      onSubmit={onSubmit}
      variant={variant}
      elevation={elevation}
      sx={{
        px: { xs: 8, sm: 10, md: 10 },
        py: { xs: 8, sm: 20, md: 15 },
        display: 'flex',
        flex: 1,
        maxHeight: { sm: 768, md: '100%' },
        overflowY: 'auto',
        borderRadius: 0,
      }}
    >
      <Stack sx={{ flex: 1, m: 'auto' }}>
        {typeof isLoading === 'boolean' && isLoading ? (
          <CenteredBox>
            <CircularProgress size={50} />
          </CenteredBox>
        ) : (
          <>
            {/* head */}
            {!isError && (
              <Stack sx={{ gap: 15, mb: 4 }}>
                <Logo
                  sx={{ mx: 'auto', width: { xs: 310, sm: 414 }, height: { xs: 40, sm: 54 } }}
                  withLink={false}
                />
                <Stack sx={{ gap: 3 }}>
                  <Typography variant="h3" component="h4" sx={{ fontSize: { xs: 28, sm: 34 } }}>
                    {title}
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {desc}
                  </Typography>
                </Stack>
              </Stack>
            )}
            {/* body */}
            <Stack
              sx={isError ? { alignItems: 'center', justifyContent: 'center', height: '100%' } : {}}
            >
              {children}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
