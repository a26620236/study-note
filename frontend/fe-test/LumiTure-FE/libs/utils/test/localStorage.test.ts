import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../src/localStorage';

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('SSR environment (window is undefined)', () => {
    beforeEach(() => {
      vi.stubGlobal('window', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('getLocalStorageItem should return null when window is undefined', () => {
      expect(getLocalStorageItem('key')).toBeNull();
    });

    it('setLocalStorageItem should not throw when window is undefined', () => {
      const action = () => setLocalStorageItem('key', 'value');
      expect(action).not.toThrow();
    });

    it('removeLocalStorageItem should not throw when window is undefined', () => {
      const action = () => removeLocalStorageItem('key');
      expect(action).not.toThrow();
    });
  });

  describe('getLocalStorageItem', () => {
    it('should return null when key does not exist', () => {
      expect(getLocalStorageItem('nonexistent')).toBeNull();
    });

    it('should return null for empty stored value', () => {
      localStorage.setItem('key', '');
      expect(getLocalStorageItem('key')).toBeNull();
    });

    it('should return parsed object value', () => {
      // Arrange
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice' }));

      // Act
      const result = getLocalStorageItem<{ id: number; name: string }>('user');

      // Assert
      expect(result).toEqual({ id: 1, name: 'Alice' });
    });

    it('should return parsed primitive value', () => {
      localStorage.setItem('count', JSON.stringify(42));
      expect(getLocalStorageItem<number>('count')).toBe(42);
    });
  });

  describe('setLocalStorageItem', () => {
    it('should store object as JSON string', () => {
      // Arrange
      const value = { id: 1, name: 'Alice' };

      // Act
      setLocalStorageItem('user', value);

      // Assert
      expect(localStorage.getItem('user')).toBe(JSON.stringify(value));
    });

    it('should store string value', () => {
      setLocalStorageItem('key', 'hello');
      expect(localStorage.getItem('key')).toBe('"hello"');
    });

    it('should store number value', () => {
      setLocalStorageItem('count', 42);
      expect(localStorage.getItem('count')).toBe('42');
    });
  });

  describe('removeLocalStorageItem', () => {
    it('should remove an existing key', () => {
      // Arrange
      localStorage.setItem('key', 'value');

      // Act
      removeLocalStorageItem('key');

      // Assert
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('should not throw when key does not exist', () => {
      const action = () => removeLocalStorageItem('nonexistent');
      expect(action).not.toThrow();
    });
  });
});
