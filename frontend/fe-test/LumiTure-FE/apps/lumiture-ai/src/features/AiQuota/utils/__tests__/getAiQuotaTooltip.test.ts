import { AiQuotaServiceType } from '@hooks-api';

import { getAiQuotaTooltip } from '../getAiQuotaTooltip';

describe('getAiQuotaTooltip', () => {
  it('returns empty string for Normal status', () => {
    expect(
      getAiQuotaTooltip({ serviceType: AiQuotaServiceType.AiPoweredAnalyses, remaining: 100, total: 100 })
    ).toBe('');
  });

  it('builds the approaching message with unit / label / total', () => {
    const result = getAiQuotaTooltip({
      serviceType: AiQuotaServiceType.AiPoweredAnalyses,
      remaining: 10,
      total: 100,
    });

    expect(result).toContain('100 AI analyses');
    expect(result).toContain('is approaching');
    expect(result).toContain('Cost Dashboard');
  });

  it('builds the reached message with thousands-separated total', () => {
    const result = getAiQuotaTooltip({
      serviceType: AiQuotaServiceType.RightsizingScans,
      remaining: 0,
      total: 2000,
    });

    expect(result).toContain('2,000 Rightsizing scans');
    expect(result).toContain('has been reached');
    expect(result).toContain('Usage Optimization');
  });
});
