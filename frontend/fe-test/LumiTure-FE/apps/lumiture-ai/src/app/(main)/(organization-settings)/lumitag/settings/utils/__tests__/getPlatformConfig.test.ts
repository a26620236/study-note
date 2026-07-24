import { describe, expect, it } from 'vitest';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';

import { getPlatformConfig } from '../getPlatformConfig';

describe('getPlatformConfig', () => {
  it('returns GCP config for PlatformsValue.GCP', () => {
    expect(getPlatformConfig(PlatformsValue.GCP)).toBe(PLATFORM_CONFIG[PlatformsValue.GCP]);
  });

  it('returns AWS config for PlatformsValue.AWS', () => {
    expect(getPlatformConfig(PlatformsValue.AWS)).toBe(PLATFORM_CONFIG[PlatformsValue.AWS]);
  });

  it('returns Azure config for PlatformsValue.AZURE', () => {
    expect(getPlatformConfig(PlatformsValue.AZURE)).toBe(PLATFORM_CONFIG[PlatformsValue.AZURE]);
  });

  it('returned config has label and icon', () => {
    const config = getPlatformConfig(PlatformsValue.GCP);
    expect(config.label).toBe('Google Cloud');
    expect(config.icon).toBeDefined();
  });
});
