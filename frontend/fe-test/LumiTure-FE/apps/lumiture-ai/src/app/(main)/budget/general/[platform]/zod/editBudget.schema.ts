import { z } from 'zod';

import { BudgetAction } from '../constants/budget';

export const createEditBudgetSchema = (currentAction: BudgetAction, minAmount: number) =>
  z.object({
    amount:
      currentAction === BudgetAction.REBALANCE
        ? z.null().optional()
        : z.number().int().gte(minAmount),
  });

export type EditBudgetSchema = z.infer<ReturnType<typeof createEditBudgetSchema>>;
