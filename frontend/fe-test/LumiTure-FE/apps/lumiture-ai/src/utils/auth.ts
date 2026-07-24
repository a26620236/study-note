import { getServerSession, type NextAuthOptions, type User } from 'next-auth';
import MicrosoftProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { OAuthError } from '@app/(auth)/login/constants/login';
import {
  AUTH_PATHS,
  currencyMap,
  ERROR_CODES,
  OAuthProviderEnum,
  type CurrencyCode,
} from '@constants';
import type { PostLoginResponse } from '@hooks-api';

import { api, ApiError } from './api';

function isOAuthProvider(provider: string): provider is OAuthProviderEnum {
  const oauthProviders: string[] = Object.values(OAuthProviderEnum);
  return oauthProviders.includes(provider);
}

interface OAuthAccount {
  provider: OAuthProviderEnum;
  id_token?: string;
  access_token?: string;
}

function buildOAuthRequestBody(account: OAuthAccount, email: string) {
  switch (account.provider) {
    case OAuthProviderEnum.Google:
      return { provider: OAuthProviderEnum.Google, id_token: account.id_token ?? '', email };
    case OAuthProviderEnum.AzureAd:
      return { provider: 'microsoft', id_token: account.id_token ?? '', email };
    case OAuthProviderEnum.GitHub:
      return {
        provider: OAuthProviderEnum.GitHub,
        access_token: account.access_token ?? '',
        email,
      };
  }
}

async function getClientIp(): Promise<string | null> {
  try {
    const { headers: getRequestHeaders } = await import('next/headers');
    const requestHeaders = await getRequestHeaders();
    return requestHeaders.get('x-forwarded-for') ?? requestHeaders.get('x-real-ip');
  } catch {
    return null;
  }
}

async function handleOAuthSignIn(user: User, account: OAuthAccount) {
  const requestBody = buildOAuthRequestBody(account, user.email);
  const clientIp = await getClientIp();
  const { access } = await api.post<PostLoginResponse>(`/api/oauth/login/`, {
    requestBody,
    headers: clientIp ? { 'X-Forwarded-For': clientIp } : {},
  });

  const userProfile = await api.get<User>(`/user/profile`, {
    headers: { Authorization: `Bearer ${access}` },
  });

  Object.assign(user, { ...userProfile, access });
}

/*
  Ref
    - CredentialsProvider: https://next-auth.js.org/v3/configuration/providers#credentials-provider
    - callbacks: https://next-auth.js.org/configuration/callbacks
*/

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@mail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        try {
          const { email = '', password = '' } = credentials ?? {};
          // * NextAuth 將 req.headers 定義為 Record<string, any>，宣告成 unknown 以避免 unsafe-assignment
          const ipHeader: unknown = req.headers?.['x-forwarded-for'] ?? req.headers?.['x-real-ip'];
          const clientIp =
            typeof ipHeader === 'string' ? ipHeader.split(',')[0]?.trim() : undefined;

          // * 後端其實有給 refresh token 所以之後若要做 refresh 再補回
          const { access } = await api.post<PostLoginResponse>(`/api/token/`, {
            requestBody: { email, password },
            headers: clientIp ? { 'X-Forwarded-For': clientIp } : {},
          });

          const user = await api.get<User>(`/user/profile`, {
            headers: { [`Authorization`]: `Bearer ${access}` },
          });

          return { ...user, access };
        } catch (error) {
          if (error instanceof ApiError) {
            const getMessage = () => {
              const code = typeof error.data?.code === 'string' ? error.data.code : '';
              if (code in ERROR_CODES) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                return ERROR_CODES[code as keyof typeof ERROR_CODES].message;
              }
              return 'Please try again later, or contact your admin for help.';
            };

            const message = getMessage();

            throw new ApiError(error.status, message, error.data);
          }
          throw new ApiError(500, 'Network error or unexpected error occurred');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: { params: { prompt: 'select_account' } },
    }),
    MicrosoftProvider({
      id: 'microsoft',
      clientId: process.env.MICROSOFT_CLIENT_ID ?? '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
      authorization: { params: { prompt: 'select_account' } },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: { params: { scope: 'read:user user:email', prompt: 'select_account' } },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !isOAuthProvider(account.provider)) return true;

      try {
        await handleOAuthSignIn(user, {
          provider: account.provider,
          id_token: account.id_token,
          access_token: account.access_token,
        });
        return true;
      } catch (error) {
        console.error('OAuth sign-in error:', error);
        const code =
          error instanceof ApiError ? (error.data?.code ?? OAuthError.Default) : OAuthError.Default;
        return `${AUTH_PATHS.login.pathname}?error=${code}`;
      }
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({ trigger, token, session, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let updatedUser = { ...token.user };

      // signIn
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedUser = { ...updatedUser, ...user };
      }

      if (trigger === 'update') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedUser = { ...updatedUser, ...session };
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unsafe-member-access -- legacy code
      const currency = updatedUser.currency as CurrencyCode;
      const currencyInfo = currencyMap[currency];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updatedUser.currencyInfo = currencyInfo;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
      token.user = updatedUser;

      return token;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: AUTH_PATHS.login.pathname,
    error: AUTH_PATHS.login.pathname,
  },
};

export async function getAuthStatus() {
  const session = await getServerSession(authOptions);
  const isLogin = !!session?.user.access;
  const hasDefaultRoleGroup = !!session?.user.group?.groupId;

  return {
    session,
    isLogin,
    hasDefaultRoleGroup,
  };
}

export async function handleAuthRedirect() {
  const { isLogin, hasDefaultRoleGroup } = await getAuthStatus();

  return {
    shouldRedirectToOverview: isLogin && hasDefaultRoleGroup,
    shouldRedirectToAuth: !isLogin || !hasDefaultRoleGroup,
  };
}
