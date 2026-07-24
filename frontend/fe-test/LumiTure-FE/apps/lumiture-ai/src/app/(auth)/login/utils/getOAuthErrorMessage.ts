import { OAuthError } from '../constants/login';

export const LABELS = {
  [OAuthError.OAuthSignIn]: `We're having trouble connecting to your login service. Please try again later.`,
  [OAuthError.OAuthCallback]: 'The sign-in process was interrupted. Please try again.',
  [OAuthError.Default]: 'Unable to verify your account. Please try again.',
} as const;

const isValidOAuthError = (error: string): error is keyof typeof LABELS => error in LABELS;

export const getOAuthErrorMessage = (error: string): string =>
  isValidOAuthError(error) ? LABELS[error] : LABELS[OAuthError.Default];
