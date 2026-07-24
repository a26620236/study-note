import { getIsEmptyValue } from '../src/getIsEmptyValue';

describe('getIsEmptyValue', () => {
  it.each([
    { value: null, label: 'null' },
    { value: undefined, label: 'undefined' },
    { value: '', label: 'empty string' },
    { value: 0, label: '0' },
    { value: '0', label: 'string "0"' },
  ])('should return true for $label', ({ value }) => {
    expect(getIsEmptyValue(value)).toBe(true);
  });

  it.each([
    { value: 1, label: 'positive number' },
    { value: -1, label: 'negative number' },
    { value: 0.1, label: 'decimal' },
    { value: 'hello', label: 'non-empty string' },
    { value: {}, label: 'empty object' },
  ])('should return false for $label', ({ value }) => {
    expect(getIsEmptyValue(value)).toBe(false);
  });
});
