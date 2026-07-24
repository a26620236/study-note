import { describe, expect, it } from 'vitest';

import { Logic, Operator } from '@hooks-api';

import { GCPField } from '../../constants/lumiTagFields';
import { createDefaultCondition } from '../createDefaultCondition';

describe('createDefaultCondition', () => {
  it('returns a condition with the provided field and logic', () => {
    const result = createDefaultCondition(GCPField.Service, Logic.And);

    expect(result).toEqual({
      logic: Logic.And,
      field: GCPField.Service,
      criteria: {
        operator: Operator.Equals,
        values: [],
      },
    });
  });

  it('supports Logic.Base for the first condition in a scope', () => {
    const result = createDefaultCondition(GCPField.Region, Logic.Base);

    expect(result.logic).toBe(Logic.Base);
    expect(result.field).toBe(GCPField.Region);
  });

  it('supports Logic.Or for alternative branches', () => {
    const result = createDefaultCondition(GCPField.ProjectId, Logic.Or);

    expect(result.logic).toBe(Logic.Or);
  });

  it('always defaults criteria to Operator.Equals with an empty values array', () => {
    const result = createDefaultCondition(GCPField.Service, Logic.And);

    expect(result.criteria).toEqual({
      operator: Operator.Equals,
      values: [],
    });
  });
});
