import { OAuthError } from '../../constants/login';
import { getOAuthErrorMessage, LABELS as OAUTH_ERROR_MESSAGES } from '../getOAuthErrorMessage';

describe('getOAuthErrorMessage', () => {
  describe('when error is a known OAuth error code', () => {
    it.each([
      { error: OAuthError.OAuthSignIn, label: 'OAuthSignIn' },
      { error: OAuthError.OAuthCallback, label: 'OAuthCallback' },
      { error: OAuthError.Default, label: 'Default' },
    ])('should return the mapped message for $label', ({ error }) => {
      expect(getOAuthErrorMessage(error)).toBe(OAUTH_ERROR_MESSAGES[error]);
    });
  });

  describe('when error is not in the OAUTH_ERROR_MESSAGES mapping', () => {
    it.each([
      { error: 'unknown_error', label: 'an unknown error code' },
      { error: '', label: 'an empty string' },
      { error: OAuthError.NotInvited, label: 'NotInvited (not in mapping)' },
    ])('should fall back to the default message for $label', ({ error }) => {
      expect(getOAuthErrorMessage(error)).toBe(OAUTH_ERROR_MESSAGES[OAuthError.Default]);
    });
  });
});
