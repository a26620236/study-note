import { Operator, type Logic } from '@hooks-api';

import type { FieldKey } from '../constants/lumiTagFields';

export function createDefaultCondition(field: FieldKey, logic: Logic) {
  return {
    logic,
    field,
    criteria: {
      operator: Operator.Equals,
      values: [],
    },
  };
}
