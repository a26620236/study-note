import { useFieldArray, useFormContext, type FieldArrayWithId } from 'react-hook-form';

import type { PlatformsValue } from '@constants';
import { Logic } from '@hooks-api';

import { ALL_PLATFORMS, PLATFORM_FIELD_META } from '../constants/lumiTagSettings';
import { createDefaultCondition } from '../utils/createDefaultCondition';
import type { LumiTagFormData } from '../zod/lumiTagSettings.schema';

type ScopesFieldName = `values.${number}.scopes`;

export interface UseScopeArrayFieldResult {
  fields: FieldArrayWithId<LumiTagFormData, ScopesFieldName>[];
  availablePlatforms: PlatformsValue[];
  addScope: (platform: PlatformsValue) => void;
  removeScope: (scopeIndex: number) => void;
}

export function useScopeArrayField(valueIndex: number): UseScopeArrayFieldResult {
  const { control } = useFormContext<LumiTagFormData>();
  // Grab clearErrors from an un-generic-typed context so its path param widens to `string`.
  // This lets us pass RHF's synthetic `.root` key without casting against the form's FieldPath union.
  const { clearErrors } = useFormContext();
  const fieldName = `values.${valueIndex}.scopes` as const;
  const { fields, append, remove } = useFieldArray({ control, name: fieldName });

  const usedPlatforms = fields.map((field) => field.platform);
  const availablePlatforms = ALL_PLATFORMS.filter((platform) => !usedPlatforms.includes(platform));

  function addScope(platform: PlatformsValue) {
    const firstField = PLATFORM_FIELD_META[platform][0].key;
    append({
      platform,
      conditions: [createDefaultCondition(firstField, Logic.Base)],
    });
    // append is a programmatic mutation, so RHF doesn't auto re-run the schema's array-level validation (.min(1)).
    // Clear only `.root` — the synthetic key zodResolver uses to store array-level errors on useFieldArray-registered paths —
    // to avoid wiping existing child errors (e.g. condition validation errors in other scopes).
    clearErrors(`${fieldName}.root`);
  }

  return {
    fields,
    availablePlatforms,
    addScope,
    removeScope: remove,
  };
}
