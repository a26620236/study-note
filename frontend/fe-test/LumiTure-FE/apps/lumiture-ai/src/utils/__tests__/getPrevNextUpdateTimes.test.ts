import { getPrevNextUpdateTimes } from '../getPrevNextUpdateTimes';

describe('getPrevNextUpdateTimes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return { prev: null, next: null } for empty times array', () => {
    expect(getPrevNextUpdateTimes({ times: [] })).toEqual({ prev: null, next: null });
  });

  it('should return { prev: null, next: null } for non-array input', () => {
    // @ts-expect-error testing invalid input
    expect(getPrevNextUpdateTimes({ times: null })).toEqual({ prev: null, next: null });
  });

  it('should return prev and next when current time is between two time points', () => {
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));

    const result = getPrevNextUpdateTimes({ times: ['08:00', '12:00'], inputTimeZone: 'UTC' });

    expect(result.prev).toBe('2024/01/15 08:00');
    expect(result.next).toBe('2024/01/15 12:00');
  });

  it('should use last time as prev and next day first time when all times have passed', () => {
    vi.setSystemTime(new Date('2024-01-15T23:00:00.000Z'));

    const result = getPrevNextUpdateTimes({ times: ['08:00', '12:00'], inputTimeZone: 'UTC' });

    expect(result.prev).toBe('2024/01/15 12:00');
    expect(result.next).toBe('2024/01/16 08:00');
  });

  it('should use previous day last time as prev when before first time point', () => {
    vi.setSystemTime(new Date('2024-01-15T06:00:00.000Z'));

    const result = getPrevNextUpdateTimes({ times: ['08:00', '12:00'], inputTimeZone: 'UTC' });

    expect(result.prev).toBe('2024/01/14 12:00');
    expect(result.next).toBe('2024/01/15 08:00');
  });

  it('should sort time points before comparing', () => {
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));

    const result = getPrevNextUpdateTimes({ times: ['12:00', '08:00'], inputTimeZone: 'UTC' });

    expect(result.prev).toBe('2024/01/15 08:00');
    expect(result.next).toBe('2024/01/15 12:00');
  });
});
