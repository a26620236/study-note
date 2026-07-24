import { parseUrl } from '../src/parseUrl';

describe('parseUrl', () => {
  it('should return empty object when url is undefined', () => {
    expect(parseUrl()).toEqual({});
  });

  it('should return empty object when url is empty string', () => {
    expect(parseUrl('')).toEqual({});
  });

  it('should parse a JSON-encoded and URI-encoded object', () => {
    // Arrange
    const obj = { key: 'value', num: 42 };
    const encoded = encodeURIComponent(JSON.stringify(obj));

    // Act
    const result = parseUrl(encoded);

    // Assert
    expect(result).toEqual(obj);
  });

  it('should parse nested objects', () => {
    const obj = { filter: { status: 'active' }, page: 1 };
    const encoded = encodeURIComponent(JSON.stringify(obj));
    expect(parseUrl(encoded)).toEqual(obj);
  });

  it('should return empty object and log error for invalid JSON', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockReturnValue(undefined);

    const result = parseUrl('not-valid-json');

    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
