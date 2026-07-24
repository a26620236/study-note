import type { GroupRow } from '@hooks-api';

import type { ChildGroupsBudget } from '../types/budgetSettings';

// API child_groups（新格式 GroupRow[] + period[]）→ RHF 表單值（以 id / period 為 key 的巢狀 object）
export const toFormValues = (groups: GroupRow[], periods: string[]): ChildGroupsBudget =>
  Object.fromEntries(
    groups.map((group) => [
      group.id,
      Object.fromEntries(periods.map((period) => [period, group[period].value])),
    ])
  );
