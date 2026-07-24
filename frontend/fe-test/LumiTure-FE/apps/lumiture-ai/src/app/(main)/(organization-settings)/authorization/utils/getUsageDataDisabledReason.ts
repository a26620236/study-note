export type UsageDataDisabledReason = 'no-billing' | 'all-paired' | null;

export function getUsageDataDisabledReason(
  billingCount: number,
  usageCount: number
): UsageDataDisabledReason {
  if (billingCount === 0) return 'no-billing';
  if (billingCount === usageCount) return 'all-paired';
  return null;
}
