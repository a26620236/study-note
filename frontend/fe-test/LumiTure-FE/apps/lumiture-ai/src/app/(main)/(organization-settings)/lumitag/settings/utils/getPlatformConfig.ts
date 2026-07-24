import { PLATFORM_CONFIG, type PlatformsValue } from '@constants';

export function getPlatformConfig(platform: PlatformsValue) {
  return PLATFORM_CONFIG[platform];
}
