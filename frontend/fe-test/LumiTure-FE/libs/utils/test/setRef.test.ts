import { setRef } from '../src/setRef';

describe('setRef', () => {
  it('should call ref callback with the given value', () => {
    // Arrange
    const callback = vi.fn();

    // Act
    setRef(callback, 'value');

    // Assert
    expect(callback).toHaveBeenCalledWith('value');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should set ref.current when ref is a RefObject', () => {
    const ref = { current: null as string | null };
    setRef(ref, 'value');
    expect(ref.current).toBe('value');
  });

  it('should set ref.current to null', () => {
    const ref = { current: 'old-value' as string | null };
    setRef(ref, null);
    expect(ref.current).toBeNull();
  });

  it('should do nothing when ref is null', () => {
    expect(() => setRef(null, 'value')).not.toThrow();
  });

  it('should do nothing when ref is undefined', () => {
    expect(() => setRef(undefined, 'value')).not.toThrow();
  });
});
