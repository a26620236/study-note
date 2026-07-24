// TODO: generateSortedSeries is legacy code — this test only ensures current behavior; refactor planned
import type { SpendingGroupData } from '@app/(main)/components/optimize-cloud-spend/utils/transformGroupData';

import { generateSortedSeries } from '../generateSortedSeries';

function createGroupData(overrides?: Partial<SpendingGroupData>): SpendingGroupData {
  return {
    groupName: [],
    awsCost: [],
    awsBudget: [],
    gcpCost: [],
    gcpBudget: [],
    azureCost: [],
    azureBudget: [],
    budget: [],
    ...overrides,
  };
}

describe('generateSortedSeries', () => {
  it('should return empty series when all cost arrays are empty', () => {
    const result = generateSortedSeries(createGroupData());

    expect(result.series).toEqual([]);
    expect(result.groupNames).toEqual([]);
  });

  it('should return empty series when all costs are null (hasData returns false)', () => {
    const result = generateSortedSeries(
      createGroupData({
        groupName: ['Group A'],
        gcpCost: [null],
        awsCost: [null],
        azureCost: [null],
      })
    );

    expect(result.series).toEqual([]);
  });

  it('should add GCP cost series with correct name and stack', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [100], gcpBudget: [200] })
    );
    const series = result.series.find((s) => s.name === 'Google Cloud');

    expect(series?.type).toBe('bar');
    expect(series?.stack).toBe('cost');
  });

  it('should add AWS cost series', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], awsCost: [50], awsBudget: [100] })
    );

    expect(result.series.find((s) => s.name === 'AWS')).toBeDefined();
  });

  it('should add Azure cost series', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], azureCost: [75], azureBudget: [100] })
    );

    expect(result.series.find((s) => s.name === 'Azure')).toBeDefined();
  });

  it('should not add a platform series when all its costs are null', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [100], awsCost: [null] })
    );

    expect(result.series.find((s) => s.name === 'AWS')).toBeUndefined();
  });

  it('should add Total Budget series with stack "budget" when budget has numeric values', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [100], budget: [300] })
    );
    const series = result.series.find((s) => s.name === 'Total Budget');

    expect(series?.stack).toBe('budget');
  });

  it('should not add Total Budget series when all budget values are null', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [100], budget: [null] })
    );

    expect(result.series.find((s) => s.name === 'Total Budget')).toBeUndefined();
  });

  it('should set isOverrun true when cost exceeds budget', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [200], gcpBudget: [100] })
    );
    const series = result.series.find((s) => s.name === 'Google Cloud');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    expect((series?.data as { isOverrun: boolean }[])[0].isOverrun).toBe(true);
  });

  it('should set isOverrun false when cost is within budget', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [100], gcpBudget: [200] })
    );
    const series = result.series.find((s) => s.name === 'Google Cloud');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    expect((series?.data as { isOverrun: boolean }[])[0].isOverrun).toBe(false);
  });

  it('should set isOverrun false when budget is null', () => {
    const result = generateSortedSeries(
      createGroupData({ groupName: ['A'], gcpCost: [300], gcpBudget: [null] })
    );
    const series = result.series.find((s) => s.name === 'Google Cloud');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    expect((series?.data as { isOverrun: boolean }[])[0].isOverrun).toBe(false);
  });

  it('should use value 0 when cost is null (sorted desc, null item ends up at index 1)', () => {
    const result = generateSortedSeries(
      createGroupData({
        groupName: ['A', 'B'],
        gcpCost: [50, null],
        gcpBudget: [null, null],
      })
    );
    const series = result.series.find((s) => s.name === 'Google Cloud');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    expect((series?.data as { value: number }[])[1].value).toBe(0);
  });

  it('should sort groups by total cost descending by default', () => {
    // Group A=10, Group B=30, Group C=20 → desc: B, C, A
    const result = generateSortedSeries(
      createGroupData({
        groupName: ['A', 'B', 'C'],
        gcpCost: [10, 30, 20],
        gcpBudget: [null, null, null],
      })
    );

    expect(result.groupNames).toEqual(['B', 'C', 'A']);
  });

  it('should sort groups by total cost ascending when order is "asc"', () => {
    // Group A=10, Group B=30, Group C=20 → asc: A, C, B
    const result = generateSortedSeries(
      createGroupData({
        groupName: ['A', 'B', 'C'],
        gcpCost: [10, 30, 20],
        gcpBudget: [null, null, null],
      }),
      'asc'
    );

    expect(result.groupNames).toEqual(['A', 'C', 'B']);
  });

  it('should reorder series data to match sorted group order', () => {
    const result = generateSortedSeries(
      createGroupData({
        groupName: ['A', 'B', 'C'],
        gcpCost: [10, 30, 20],
        gcpBudget: [null, null, null],
      })
    );
    const series = result.series.find((s) => s.name === 'Google Cloud');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    const values = (series?.data as { value: number }[]).map((d) => d.value);

    expect(values).toEqual([30, 20, 10]);
  });

  it('should sort by sum across all platforms', () => {
    // A: gcp=10 + aws=5 = 15, B: gcp=20 + aws=5 = 25 → desc: B, A
    const result = generateSortedSeries(
      createGroupData({
        groupName: ['A', 'B'],
        gcpCost: [10, 20],
        gcpBudget: [null, null],
        awsCost: [5, 5],
        awsBudget: [null, null],
      })
    );

    expect(result.groupNames).toEqual(['B', 'A']);
  });
});
