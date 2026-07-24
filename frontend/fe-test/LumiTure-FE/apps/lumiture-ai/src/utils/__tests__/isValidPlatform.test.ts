import { PlatformsValue } from '@constants';

import { isValidPlatform } from '../isValidPlatform';

describe('isValidPlatform', () => {
  it.each([
    { platform: PlatformsValue.GCP, label: 'GCP' },
    { platform: PlatformsValue.AWS, label: 'AWS' },
    { platform: PlatformsValue.AZURE, label: 'Azure' },
  ])('should return true for valid platform: $label', ({ platform }) => {
    expect(isValidPlatform(platform)).toBe(true);
  });

  it('should return false for an invalid platform value', () => {
    expect(isValidPlatform('invalid')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidPlatform('')).toBe(false);
  });
});
