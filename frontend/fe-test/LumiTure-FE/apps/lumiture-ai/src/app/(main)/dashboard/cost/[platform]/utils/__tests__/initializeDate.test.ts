import { initializeDate } from '../initializeDate';

describe('initializeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-19'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return endDate as yesterday in YYYY-MM-DD format', () => {
    const { endDate } = initializeDate();

    expect(endDate).toBe('2026-03-18');
  });

  it('should return startDate as 30 days ago in YYYY-MM-DD format', () => {
    const { startDate } = initializeDate();

    expect(startDate).toBe('2026-02-17');
  });

  it('should return dates matching YYYY-MM-DD pattern', () => {
    const { startDate, endDate } = initializeDate();

    expect(startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
    expect(endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
  });

  it('should return startDate before endDate', () => {
    const { startDate, endDate } = initializeDate();

    expect(new Date(startDate).getTime()).toBeLessThan(new Date(endDate).getTime());
  });
});
