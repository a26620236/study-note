import { useFieldArray, useFormContext, type FieldArrayWithId } from 'react-hook-form';

import { MAX_VALUES } from '../constants/lumiTagSettings';
import type { LumiTagFormData } from '../zod/lumiTagSettings.schema';

export interface UseValueArrayFieldResult {
  fields: FieldArrayWithId<LumiTagFormData, 'values'>[];
  appendValue: () => void;
  duplicateValue: (index: number) => void;
  removeValue: (index: number) => void;
  moveValue: (from: number, to: number) => void;
  canAddMore: boolean;
}

export function useValueArrayField(): UseValueArrayFieldResult {
  const { control, getValues, setValue } = useFormContext<LumiTagFormData>();
  const { fields, append, insert, remove, move } = useFieldArray({ control, name: 'values' });

  // Re-aligns each value's displayOrder with its current array index.
  // Uses setValue (not update/replace) so RHF doesn't regenerate field.id and
  // the React component instance for each card—and its local state—stays alive.
  function syncDisplayOrder() {
    const values = getValues('values');
    values.forEach((value, order) => {
      if (value.displayOrder !== order) {
        setValue(`values.${order}.displayOrder`, order);
      }
    });
  }

  function appendValue() {
    append({
      name: '',
      displayOrder: fields.length,
      scopes: [],
    });
  }

  function duplicateValue(index: number) {
    const source = getValues(`values.${index}`);
    insert(index + 1, {
      name: `${source.name} (Copy)`,
      displayOrder: index + 1,
      scopes: source.scopes,
    });
    syncDisplayOrder();
  }

  function removeValue(index: number) {
    remove(index);
    syncDisplayOrder();
  }

  function moveValue(from: number, to: number) {
    move(from, to);
    syncDisplayOrder();
  }

  return {
    fields,
    appendValue,
    duplicateValue,
    removeValue,
    moveValue,
    canAddMore: fields.length < MAX_VALUES,
  };
}
