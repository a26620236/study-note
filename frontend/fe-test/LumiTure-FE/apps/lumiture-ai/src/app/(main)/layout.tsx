import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { MainLayoutFrameProvider } from '@components/layout/MainLayoutFrame/MainLayoutFrameProvider';
import { AUTH_PATHS } from '@constants';
import { handleAuthRedirect } from '@utils';

export default async function MainLayout({ children }: PropsWithChildren) {
  const { shouldRedirectToAuth } = await handleAuthRedirect();

  if (shouldRedirectToAuth) {
    redirect(AUTH_PATHS.login.pathname);
  }

  return <MainLayoutFrameProvider>{children}</MainLayoutFrameProvider>;
}
