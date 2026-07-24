import type { PlatformValueWithFOCUS } from '@constants';
import {
  AWSChargeTypes,
  FOCUSCredit,
  type AWSFilter,
  type AzureFilter,
  type FOCUSFilter,
  type GCPFilter,
} from '@hooks-api';

/**
 * Check if credits are selected in platform filters
 * @param platform - The platform value (GCP, AWS, AZURE, or FOCUS)
 * @param platformFilters - The platform-specific filter object
 * @returns true if credits are selected, false otherwise
 */
export function hasCreditsSelected(
  platform: PlatformValueWithFOCUS,
  platformFilters: GCPFilter | AWSFilter | AzureFilter | FOCUSFilter
): boolean {
  // GCP: credits 陣列不為空即代表有選擇
  if ('projects' in platformFilters) {
    return platformFilters.credits.length > 0;
  }

  // AWS 只判斷是否選擇了 Credit, 不判斷其他 ChargeTypes
  if ('accounts' in platformFilters) {
    return platformFilters.chargeTypes.includes(AWSChargeTypes.Credit);
  }

  // Azure: 無 credits 顯示
  if ('resourceGroups' in platformFilters) {
    return false;
  }

  // FOCUS: credits[0] 為 On 時顯示 credits 欄
  return platformFilters.credits[0] === FOCUSCredit.On;
}
