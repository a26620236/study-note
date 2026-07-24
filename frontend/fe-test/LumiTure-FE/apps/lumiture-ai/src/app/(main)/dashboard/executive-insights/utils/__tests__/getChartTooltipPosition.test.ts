import { getChartTooltipPosition } from '../getChartTooltipPosition';

describe('getChartTooltipPosition', () => {
  it('should offset x by +10 and position y above tooltip height by -10', () => {
    const point: [number, number] = [100, 200];
    const size: { contentSize: [number, number]; viewSize: [number, number] } = {
      contentSize: [150, 80],
      viewSize: [800, 600],
    };

    // x + 10 = 110, y - tooltipHeight - 10 = 200 - 80 - 10 = 110
    const result = getChartTooltipPosition(point, [], null, null, size);

    expect(result).toEqual([110, 110]);
  });

  it('should handle zero-height tooltip', () => {
    const point: [number, number] = [50, 100];
    const size: { contentSize: [number, number]; viewSize: [number, number] } = {
      contentSize: [200, 0],
      viewSize: [800, 600],
    };

    const result = getChartTooltipPosition(point, [], null, null, size);

    expect(result).toEqual([60, 90]);
  });

  it('should handle position at origin', () => {
    const point: [number, number] = [0, 0];
    const size: { contentSize: [number, number]; viewSize: [number, number] } = {
      contentSize: [100, 50],
      viewSize: [800, 600],
    };

    // x + 10 = 10, y - 50 - 10 = -60
    const result = getChartTooltipPosition(point, [], null, null, size);

    expect(result).toEqual([10, -60]);
  });

  it('should correctly use contentSize[1] as tooltip height', () => {
    const point: [number, number] = [200, 300];
    const size: { contentSize: [number, number]; viewSize: [number, number] } = {
      contentSize: [150, 120],
      viewSize: [800, 600],
    };

    const result = getChartTooltipPosition(point, [], null, null, size);

    expect(result).toEqual([210, 170]);
  });
});
