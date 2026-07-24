import { PlatformsValue } from '@constants';

export const isValidPlatform = (platform: string): platform is PlatformsValue => {
  const validPlatforms: string[] = Object.values(PlatformsValue);
  return validPlatforms.includes(platform);
};
