'use client';

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography } from '@mui/material';
import { useFormContext, useFormState } from 'react-hook-form';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';
import { popSuccessToast } from '@shared/utils';

import { MAX_VALUES } from '../constants/lumiTagSettings';
import { useValueArrayField } from '../hooks/useValueArrayField';
import type { LumiTagFormData } from '../zod/lumiTagSettings.schema';
import { LumiTagEmptyState } from './LumiTagEmptyState';
import { LumiTagValueCard } from './LumiTagValueCard/LumiTagValueCard';

const LABELS = {
  sectionTitle: 'Tag Values',
  addValue: '+ Add Value',
  maxValuesReached: `Maximum ${MAX_VALUES} values reached.`,
  explanation: `A cost record matches this tag value when **ANY** data source block's conditions are met.\n\nWithin each block, conditions are evaluated from left to right. Use **AND** to narrow results or **OR** to broaden them. Each block supports up to 20 conditions.\n\nTo ensure data integrity, values are applied by **priority order**. Each resource is mapped to a single value within this key's scope, with automatic deduplication across rules.\n\nNote: Data will not be allocated to this tag value if no conditions are met.`,
  duplicateSuccess: 'Value condition duplicated successfully.',
};

function Explanation() {
  return (
    <VStack sx={{ gap: 0.5 }}>
      <Markdown
        components={{
          p: ({ children }) => (
            <Typography variant="caption" color="text.secondary" display="block">
              {children}
            </Typography>
          ),
        }}
      >
        {LABELS.explanation}
      </Markdown>
    </VStack>
  );
}

export function LumiTagValueSection() {
  const { fields, appendValue, duplicateValue, removeValue, moveValue, canAddMore } =
    useValueArrayField();

  const { control, getFieldState } = useFormContext<LumiTagFormData>();
  // useFormState subscribes to error changes for the top-level values array;
  // getFieldState then reads it type-safely.
  const formState = useFormState({ control, name: 'values' });
  const { error: valuesError } = getFieldState('values', formState);
  // zodResolver may put the array-level message on `.message` or under `.root.message`
  // depending on whether the array has registered useFieldArray rows; cover both.
  const valuesErrorMessage = valuesError?.root?.message ?? valuesError?.message;
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDuplicate(index: number) {
    duplicateValue(index);
    popSuccessToast({ description: LABELS.duplicateSuccess });
  }

  // Translate dnd-kit's id-based drag result into RHF array indices, then reorder.
  // active: the card being dragged; over: the card currently underneath (null if dropped on empty area).
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = fields.findIndex((field) => field.id === active.id);
    const toIndex = fields.findIndex((field) => field.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      moveValue(fromIndex, toIndex);
    }
  }

  return (
    <Paper sx={{ p: 6, borderRadius: 2 }} data-testid="lumiTag-value-section">
      <VStack sx={{ gap: 3 }}>
        <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{LABELS.sectionTitle}</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={appendValue}
            disabled={!canAddMore}
            tooltipProps={
              canAddMore ? undefined : { title: LABELS.maxValuesReached, placement: 'top' }
            }
            data-testid="add-value-button"
          >
            {LABELS.addValue}
          </Button>
        </HStack>

        {fields.length > 0 ? (
          // DndContext: the shared drag arena — must wrap all cards so each card can detect others as drop targets.
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* SortableContext: provides each card's useSortable hook with the full ordered id list so relative positions are known. */}
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack sx={{ gap: 2 }}>
                {fields.map((field, index) => (
                  <LumiTagValueCard
                    key={field.id}
                    sortableId={field.id}
                    valueIndex={index}
                    onDuplicate={() => handleDuplicate(index)}
                    onRemove={() => removeValue(index)}
                  />
                ))}
              </VStack>
            </SortableContext>
          </DndContext>
        ) : (
          <Box id="values">
            <VStack sx={{ gap: 1 }}>
              <LumiTagEmptyState hasError={Boolean(valuesErrorMessage)} />
              {valuesErrorMessage && (
                <Typography variant="body2" color="error" data-testid="values-required-error">
                  {valuesErrorMessage}
                </Typography>
              )}
            </VStack>
          </Box>
        )}
        <Explanation />
      </VStack>
    </Paper>
  );
}
