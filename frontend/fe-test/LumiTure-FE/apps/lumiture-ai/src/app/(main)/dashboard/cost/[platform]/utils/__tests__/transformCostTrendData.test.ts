import { PlatformsValue } from '@constants';
import type { CostTrend } from '@hooks-api';

import { transformCostTrendData } from '../transformCostTrendData';

type SeriesItem = CostTrend['series'][number];

function createSeriesItem(overrides?: Partial<SeriesItem>): SeriesItem {
  return {
    id: 'item-1',
    title: 'GCP',
    data: [100],
    totalCost: 100,
    totalCredits: 0,
    credits: [],
    ...overrides,
  };
}

describe('transformCostTrendData', () => {
  describe('when series or dateAxis is missing', () => {
    it('should return empty array when series is undefined', () => {
      const result = transformCostTrendData({ series: undefined, dateAxis: ['2026-03-01'] });

      expect(result).toEqual([]);
    });

    it('should return empty array when dateAxis is undefined', () => {
      const result = transformCostTrendData({
        series: [createSeriesItem()],
        dateAxis: undefined,
      });

      expect(result).toEqual([]);
    });

    it('should return empty array when both are undefined', () => {
      const result = transformCostTrendData({ series: undefined, dateAxis: undefined });

      expect(result).toEqual([]);
    });

    it('should return empty array when series is empty', () => {
      const result = transformCostTrendData({ series: [], dateAxis: ['2026-03-01'] });

      expect(result).toEqual([]);
    });
  });

  describe('when valid data is provided', () => {
    it('should map each series item to a row with dailyCosts keyed by date', () => {
      const series = [
        createSeriesItem({
          id: 'gcp-1',
          data: [100, 200],
          totalCost: 300,
          platform: PlatformsValue.GCP,
        }),
      ];
      const dateAxis = ['2026-03-01', '2026-03-02'];

      const result = transformCostTrendData({ series, dateAxis });

      expect(result).toHaveLength(1);
      expect(result[0].dailyCosts).toEqual({
        '2026-03-01': 100,
        '2026-03-02': 200,
      });
    });

    it('should use item.id as row id when id is present', () => {
      const series = [createSeriesItem({ id: 'custom-id', title: 'AWS' })];
      const dateAxis = ['2026-03-01'];

      const result = transformCostTrendData({ series, dateAxis });

      expect(result[0].id).toBe('custom-id');
    });

    it('should fall back to item.title as row id when id is absent', () => {
      const series = [createSeriesItem({ id: '', title: 'Azure', data: [75], totalCost: 75 })];
      const dateAxis = ['2026-03-01'];

      const result = transformCostTrendData({ series, dateAxis });

      expect(result[0].id).toBe('Azure');
    });

    it('should set isTotal to false for all rows', () => {
      const series = [
        createSeriesItem({ id: 'a', title: 'GCP', data: [100], totalCost: 100 }),
        createSeriesItem({ id: 'b', title: 'AWS', data: [200], totalCost: 200 }),
      ];
      const dateAxis = ['2026-03-01'];

      const result = transformCostTrendData({ series, dateAxis });

      expect(result[0].isTotal).toBe(false);
      expect(result[1].isTotal).toBe(false);
    });

    it('should preserve totalCost and platform from each series item', () => {
      const series = [createSeriesItem({ id: '1', totalCost: 500, platform: PlatformsValue.GCP })];
      const dateAxis = ['2026-03-01'];

      const result = transformCostTrendData({ series, dateAxis });

      expect(result[0].totalCost).toBe(500);
      expect(result[0].platform).toBe(PlatformsValue.GCP);
    });

    it('should handle multiple series items correctly', () => {
      const series = [
        createSeriesItem({ id: 'gcp', title: 'GCP', data: [100, 150], totalCost: 250 }),
        createSeriesItem({ id: 'aws', title: 'AWS', data: [200, 250], totalCost: 450 }),
      ];
      const dateAxis = ['2026-03-01', '2026-03-02'];

      const result = transformCostTrendData({ series, dateAxis });

      expect(result).toHaveLength(2);
      expect(result[0].dailyCosts).toEqual({ '2026-03-01': 100, '2026-03-02': 150 });
      expect(result[1].dailyCosts).toEqual({ '2026-03-01': 200, '2026-03-02': 250 });
    });
  });
});
