import { AiQuotaStatus } from '../../types/aiQuotaStatus';
import { getAiQuotaColor } from '../getAiQuotaColor';

describe('getAiQuotaColor', () => {
  it('maps each status to its theme palette token', () => {
    expect(getAiQuotaColor(AiQuotaStatus.Normal)).toBe('success.main');
    expect(getAiQuotaColor(AiQuotaStatus.Approaching)).toBe('warning.main');
    expect(getAiQuotaColor(AiQuotaStatus.Reached)).toBe('error.main');
  });
});
