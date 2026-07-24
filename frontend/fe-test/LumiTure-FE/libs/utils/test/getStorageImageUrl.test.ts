import { getStorageImageUrl } from '../src/getStorageImageUrl';

describe('getStorageImageUrl', () => {
  it('should build the correct GCS URL using the passed bucket name', () => {
    const result = getStorageImageUrl(
      'lumiture-frontend-dev',
      'images/authorization/billing/azure/azure_1_1.png'
    );

    expect(result).toBe(
      'https://storage.googleapis.com/lumiture-frontend-dev/images/authorization/billing/azure/azure_1_1.png'
    );
  });

  it('should handle nested image paths correctly', () => {
    const result = getStorageImageUrl('lumiture-frontend-prod', 'icons/logo.svg');

    expect(result).toBe('https://storage.googleapis.com/lumiture-frontend-prod/icons/logo.svg');
  });
});
