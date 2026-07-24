import { AiQuotaStatus } from '../../types/aiQuotaStatus';
import { getAiQuotaStatus } from '../getAiQuotaStatus';

describe('getAiQuotaStatus', () => {
  it('returns Normal when total <= 0', () => {
    expect(getAiQuotaStatus(0, 0)).toBe(AiQuotaStatus.Normal);
    expect(getAiQuotaStatus(5, -1)).toBe(AiQuotaStatus.Normal);
  });

  it('returns Reached when remaining <= 0', () => {
    expect(getAiQuotaStatus(0, 100)).toBe(AiQuotaStatus.Reached);
  });

  it('returns Approaching when usage reaches 80%', () => {
    expect(getAiQuotaStatus(20, 100)).toBe(AiQuotaStatus.Approaching); // usage 0.8
    expect(getAiQuotaStatus(10, 100)).toBe(AiQuotaStatus.Approaching); // usage 0.9
  });

  it('returns Normal when usage is below 80%', () => {
    expect(getAiQuotaStatus(21, 100)).toBe(AiQuotaStatus.Normal); // usage 0.79
    expect(getAiQuotaStatus(100, 100)).toBe(AiQuotaStatus.Normal); // usage 0
  });
});
