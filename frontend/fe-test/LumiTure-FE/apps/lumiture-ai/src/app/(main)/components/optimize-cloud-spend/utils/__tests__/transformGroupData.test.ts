import type { SpendingGroup } from '@hooks-api';

import { transformGroupData } from '../transformGroupData';

function createSpendingGroup(overrides?: Partial<SpendingGroup>): SpendingGroup {
  return {
    groupName: 'Group A',
    awsCost: 100,
    gcpCost: 200,
    azureCost: 300,
    awsBudget: 150,
    gcpBudget: 250,
    azureBudget: 350,
    budget: 700,
    ...overrides,
  };
}

describe('transformGroupData', () => {
  describe('when sourceData is empty', () => {
    it('should return all empty arrays', () => {
      const result = transformGroupData([]);

      expect(result).toEqual({
        groupName: [],
        awsCost: [],
        awsBudget: [],
        gcpCost: [],
        gcpBudget: [],
        azureCost: [],
        azureBudget: [],
        budget: [],
      });
    });
  });

  describe('when sourceData has a single item', () => {
    it('should extract all fields into single-element arrays', () => {
      const result = transformGroupData([createSpendingGroup()]);

      expect(result.groupName).toEqual(['Group A']);
      expect(result.awsCost).toEqual([100]);
      expect(result.awsBudget).toEqual([150]);
      expect(result.gcpCost).toEqual([200]);
      expect(result.gcpBudget).toEqual([250]);
      expect(result.azureCost).toEqual([300]);
      expect(result.azureBudget).toEqual([350]);
      expect(result.budget).toEqual([700]);
    });
  });

  describe('when sourceData has multiple items', () => {
    it('should preserve order across all arrays', () => {
      const groups = [
        createSpendingGroup({ groupName: 'Group A', awsCost: 100, budget: 700 }),
        createSpendingGroup({ groupName: 'Group B', awsCost: 200, budget: 800 }),
        createSpendingGroup({ groupName: 'Group C', awsCost: 300, budget: 900 }),
      ];

      const result = transformGroupData(groups);

      expect(result.groupName).toEqual(['Group A', 'Group B', 'Group C']);
      expect(result.awsCost).toEqual([100, 200, 300]);
      expect(result.budget).toEqual([700, 800, 900]);
    });
  });

  describe('optional budget fields (awsBudget, gcpBudget, azureBudget)', () => {
    it('should convert undefined awsBudget to null', () => {
      const result = transformGroupData([createSpendingGroup({ awsBudget: undefined })]);

      expect(result.awsBudget).toEqual([null]);
    });

    it('should convert undefined gcpBudget to null', () => {
      const result = transformGroupData([createSpendingGroup({ gcpBudget: undefined })]);

      expect(result.gcpBudget).toEqual([null]);
    });

    it('should convert undefined azureBudget to null', () => {
      const result = transformGroupData([createSpendingGroup({ azureBudget: undefined })]);

      expect(result.azureBudget).toEqual([null]);
    });

    it('should keep null awsBudget as null', () => {
      const result = transformGroupData([createSpendingGroup({ awsBudget: null })]);

      expect(result.awsBudget).toEqual([null]);
    });

    it('should keep null gcpBudget as null', () => {
      const result = transformGroupData([createSpendingGroup({ gcpBudget: null })]);

      expect(result.gcpBudget).toEqual([null]);
    });

    it('should keep null azureBudget as null', () => {
      const result = transformGroupData([createSpendingGroup({ azureBudget: null })]);

      expect(result.azureBudget).toEqual([null]);
    });
  });

  describe('nullable cost fields', () => {
    it('should preserve null awsCost', () => {
      const result = transformGroupData([createSpendingGroup({ awsCost: null })]);

      expect(result.awsCost).toEqual([null]);
    });

    it('should preserve null gcpCost', () => {
      const result = transformGroupData([createSpendingGroup({ gcpCost: null })]);

      expect(result.gcpCost).toEqual([null]);
    });

    it('should preserve null azureCost', () => {
      const result = transformGroupData([createSpendingGroup({ azureCost: null })]);

      expect(result.azureCost).toEqual([null]);
    });

    it('should preserve null budget', () => {
      const result = transformGroupData([createSpendingGroup({ budget: null })]);

      expect(result.budget).toEqual([null]);
    });
  });
});
