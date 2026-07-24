'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AxiosError } from 'axios';
import { getSession, signOut } from 'next-auth/react';

import { popErrorToast } from '@shared/utils';

import { AUTH_PATHS, MAIN_PATHS } from '@constants';
import { ApiError } from '@utils';

interface QueryProvidersProps {
  children: React.ReactNode;
}

export default function QueryProviders({ children }: QueryProvidersProps) {
  const router = useRouter();

  const queryClientOptions: QueryClientConfig = {
    defaultOptions: {
      queries: {
        // * With SSR, we usually want to set some default staleTime above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          let statusCode: number | undefined = undefined;

          // Handle original ApiError
          if (error instanceof ApiError) {
            statusCode = error.status;
          }
          // Handle Axios error
          else if (typeof error === 'object' && 'isAxiosError' in error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            const axiosError = error as AxiosError;
            statusCode = axiosError.response?.status;
          }

          if (statusCode) {
            const isClientError = Math.floor(statusCode / 100) === 4;
            if (isClientError) return false;
          }

          return failureCount < 3;
        },
      },
    },
    queryCache: new QueryCache({
      onError: async (error) => await handleUnauthorizedError(error),
    }),
    mutationCache: new MutationCache({
      onError: async (error) => await handleUnauthorizedError(error),
    }),
  };
  const [queryClient] = React.useState(() => new QueryClient(queryClientOptions));

  const handleUnauthorizedError = async (error: unknown) => {
    let statusCode: number | undefined = undefined;
    let httpMethod: string | undefined = undefined;

    // Handle original ApiError
    if (error instanceof ApiError) {
      statusCode = error.status;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      httpMethod = error.options?.method as string;
    } else if (error && typeof error === 'object' && 'isAxiosError' in error) {
      // Handle Axios error: Because the new API is built using axios, the old one is fetch
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      const axiosError = error as AxiosError;
      statusCode = axiosError.response?.status;
      httpMethod = axiosError.config?.method?.toUpperCase();
    }

    if (!statusCode) return;

    // NOTE: 未來設計出 404 頁面後，403 情境都轉跳到 404 頁面
    if (httpMethod === 'GET' && statusCode === 403) {
      router.push(MAIN_PATHS.overview.pathname);
      return;
    }

    if (statusCode === 401) {
      const session = await getSession();
      if (!session) {
        router.push(AUTH_PATHS.login.pathname);
        return;
      }

      popErrorToast({
        description: 'This page requires authorization. Please provide valid login credentials.',
      });
      queryClient.clear();
      await signOut();
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      {children}
    </QueryClientProvider>
  );
}
