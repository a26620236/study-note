import { sleep } from '../src/sleep';

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after the specified milliseconds', async () => {
    // Arrange
    const promise = sleep(1000);

    // Act
    vi.advanceTimersByTime(1000);

    // Assert
    await expect(promise).resolves.toBeUndefined();
  });

  it('should not resolve before the specified time', async () => {
    // Arrange
    let resolved = false;
    sleep(1000).then(() => {
      resolved = true;
    });

    // Act: advance by less than the full duration
    await vi.advanceTimersByTimeAsync(999);

    // Assert: not yet resolved
    expect(resolved).toBe(false);

    // Act: advance the remaining time
    await vi.advanceTimersByTimeAsync(1);

    // Assert: now resolved
    expect(resolved).toBe(true);
  });

  it('should resolve immediately for 0ms', async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await expect(promise).resolves.toBeUndefined();
  });
});
