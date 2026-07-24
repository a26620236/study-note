import * as React from 'react';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

import 'material-symbols';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleAnalytics } from '@next/third-parties/google';

import { Toaster } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import AuthSessionProvider from '@components/providers/AuthSessionProvider';
import QueryProviders from '@components/providers/QueryProviders';
import { NodeEnvName } from '@constants';

import 'react-datepicker/dist/react-datepicker.css';
import '@styles/global.css';

import { AIAnalysisListener } from '@features';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  title: 'LumiTure.ai',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={notoSans.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthSessionProvider>
              <QueryProviders>
                <Toaster />
                {children}
                <AIAnalysisListener />
              </QueryProviders>
            </AuthSessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
      <GoogleAnalytics
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        gaId={process.env.NEXT_PUBLIC_GTAG_ID!}
        debugMode={process.env.NEXT_PUBLIC_NODE_ENV_NAME !== NodeEnvName.Prod}
      />
    </html>
  );
}
