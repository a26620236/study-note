import { redirect } from 'next/navigation';

import Stack from '@mui/material/Stack';

import MainFooter from '@components/layout/MainFooter';
import { MAIN_PATHS } from '@constants';
import { handleAuthRedirect } from '@utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { shouldRedirectToOverview } = await handleAuthRedirect();

  if (shouldRedirectToOverview) {
    redirect(MAIN_PATHS.overview.pathname);
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ sm: 'center', md: 'unset' }}
      justifyContent="center"
      sx={{
        height: { sm: 'unset', md: '100vh' },
        minHeight: '100vh',
        overflow: 'auto',
        background: `url('/images/bg.svg') no-repeat center center / cover`,
      }}
    >
      <Stack sx={{ order: { xs: 2, md: 1 }, flexGrow: { xs: 0, md: 1 }, px: 8, py: 4 }}>
        <MainFooter
          sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignSelf: 'flex-end', p: 0 }}
        />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        sx={{
          order: { xs: 1, md: 2 },
          flexGrow: { xs: 1, sm: 0 },
          width: { xs: '100%', sm: 620 },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
