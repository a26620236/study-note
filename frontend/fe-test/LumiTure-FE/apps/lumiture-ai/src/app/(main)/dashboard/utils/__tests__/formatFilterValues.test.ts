import { formatFilterValues } from '../formatFilterValues';

describe('formatFilterValues', () => {
  describe('when values is empty', () => {
    it('should return "(Not Selected)" for Labels label', () => {
      const result = formatFilterValues([], 'Labels');

      expect(result).toBe('(Not Selected)');
    });

    it('should return "(Not Selected)" for Tags label', () => {
      const result = formatFilterValues([], 'Tags');

      expect(result).toBe('(Not Selected)');
    });

    it('should return "(Not Selected)" for Credits label', () => {
      const result = formatFilterValues([], 'Credits');

      expect(result).toBe('(Not Selected)');
    });

    it('should NOT return "(Not Selected)" for non-optional labels', () => {
      const result = formatFilterValues([], 'Projects');

      expect(result).not.toBe('(Not Selected)');
    });
  });

  describe('when values contains "all"', () => {
    it('should return "All {label}" format', () => {
      const result = formatFilterValues(['all'], 'Projects');

      expect(result).toBe('All Projects');
    });

    it('should return "All {label}" even when other values are present', () => {
      const result = formatFilterValues(['proj-1', 'all', 'proj-2'], 'Projects');

      expect(result).toBe('All Projects');
    });
  });

  describe('when values count is within display limit (≤ 3)', () => {
    it('should return single value as-is', () => {
      const result = formatFilterValues(['proj-1'], 'Projects');

      expect(result).toBe('proj-1');
    });

    it('should return two values joined by comma', () => {
      const result = formatFilterValues(['proj-1', 'proj-2'], 'Projects');

      expect(result).toBe('proj-1, proj-2');
    });

    it('should return three values joined by comma', () => {
      const result = formatFilterValues(['proj-1', 'proj-2', 'proj-3'], 'Projects');

      expect(result).toBe('proj-1, proj-2, proj-3');
    });
  });

  describe('when values count exceeds display limit (> 3)', () => {
    it('should show first 3 values and remaining count for 4 values', () => {
      const result = formatFilterValues(['a', 'b', 'c', 'd'], 'Projects');

      expect(result).toBe('a, b, c (+1 more)');
    });

    it('should show correct remaining count for many values', () => {
      const result = formatFilterValues(['a', 'b', 'c', 'd', 'e', 'f'], 'Projects');

      expect(result).toBe('a, b, c (+3 more)');
    });
  });
});
