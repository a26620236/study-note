import { useFieldArray, useFormContext, type FieldArrayWithId } from 'react-hook-form';

import type { PlatformsValue } from '@constants';
import { Logic } from '@hooks-api';

import { MAX_CONDITIONS, PLATFORM_FIELD_META } from '../constants/lumiTagSettings';
import { createDefaultCondition } from '../utils/createDefaultCondition';
import type { LumiTagFormData } from '../zod/lumiTagSettings.schema';

type ConditionsFieldName = `values.${number}.scopes.${number}.conditions`;

export interface UseConditionArrayFieldResult {
  fields: FieldArrayWithId<LumiTagFormData, ConditionsFieldName>[];
  appendCondition: (platform: PlatformsValue) => void;
  removeCondition: (conditionIndex: number) => void;
  canAddMore: boolean;
}

export function useConditionArrayField(
  valueIndex: number,
  scopeIndex: number
): UseConditionArrayFieldResult {
  const { control, setValue, getValues } = useFormContext<LumiTagFormData>();
  const fieldName = `values.${valueIndex}.scopes.${scopeIndex}.conditions` as const;
  const { fields, append, remove } = useFieldArray({ control, name: fieldName });

  function appendCondition(platform: PlatformsValue) {
    const firstField = PLATFORM_FIELD_META[platform][0].key;
    append(createDefaultCondition(firstField, Logic.And));
  }

  function removeCondition(conditionIndex: number) {
    remove(conditionIndex);
    // If the first condition was removed, reset the new first condition's logic to BASE
    if (conditionIndex === 0) {
      const remaining = getValues(fieldName);
      if (remaining.length > 0) {
        setValue(`${fieldName}.0.logic`, Logic.Base);
      }
    }
  }

  return {
    fields,
    appendCondition,
    removeCondition,
    canAddMore: fields.length < MAX_CONDITIONS,
  };
}
