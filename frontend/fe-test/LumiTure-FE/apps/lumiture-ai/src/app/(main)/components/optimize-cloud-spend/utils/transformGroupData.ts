import type { SpendingGroup } from '@hooks-api';

export interface SpendingGroupData {
  groupName: string[];
  awsCost: (number | null)[];
  awsBudget: (number | null)[];
  gcpCost: (number | null)[];
  gcpBudget: (number | null)[];
  azureCost: (number | null)[];
  azureBudget: (number | null)[];
  budget: (number | null)[];
}

export const transformGroupData = (sourceData: SpendingGroup[]): SpendingGroupData => {
  const result: SpendingGroupData = {
    groupName: [],
    awsCost: [],
    awsBudget: [],
    gcpCost: [],
    gcpBudget: [],
    azureCost: [],
    azureBudget: [],
    budget: [],
  };

  sourceData.forEach((group) => {
    result.groupName.push(group.groupName);
    result.awsCost.push(group.awsCost);
    result.awsBudget.push(group.awsBudget ?? null);
    result.gcpCost.push(group.gcpCost);
    result.gcpBudget.push(group.gcpBudget ?? null);
    result.azureCost.push(group.azureCost);
    result.azureBudget.push(group.azureBudget ?? null);
    result.budget.push(group.budget);
  });

  return result;
};
