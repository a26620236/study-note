'use client';

import { useEffect, useRef, useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { Box, Collapse, Typography } from '@mui/material';
import { useController, useFormContext, useFormState } from 'react-hook-form';

import { HStack, VStack } from '@lumiture-ui';
import { palette } from '@lumiture-ui/theme';

import { useScopeArrayField } from '../../hooks/useScopeArrayField';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { AddDataSourceButton } from '../LumiTagDataSourceBlock/AddDataSourceButton';
import { LumiTagDataSourceBlock } from '../LumiTagDataSourceBlock/LumiTagDataSourceBlock';
import { LumiTagEmptyState } from '../LumiTagEmptyState';
import { ValueCardHeader } from './ValueCardHeader';

interface LumiTagValueCardProps {
  sortableId: string;
  valueIndex: number;
  onDuplicate: () => void;
  onRemove: () => void;
}

export function LumiTagValueCard({
  sortableId,
  valueIndex,
  onDuplicate,
  onRemove,
}: LumiTagValueCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  });

  const { control } = useFormContext<LumiTagFormData>();
  const {
    fields: scopeFields,
    availablePlatforms,
    addScope,
    removeScope,
  } = useScopeArrayField(valueIndex);

  const namePath = `values.${valueIndex}.name` as const;
  const {
    field: nameField,
    fieldState: { error: nameError },
  } = useController<LumiTagFormData, typeof namePath>({
    control,
    name: namePath,
  });

  const { errors, submitCount } = useFormState({ control, name: `values.${valueIndex}` });
  // zodResolver may put the array-level message on `.message` or under `.root.message`
  // depending on whether the array has registered useFieldArray rows; cover both.
  const scopesError = errors.values?.[valueIndex]?.scopes;
  const scopesErrorMessage = scopesError?.root?.message ?? scopesError?.message;

  const previousSubmitCountRef = useRef(submitCount);
  useEffect(() => {
    if (submitCount > previousSubmitCountRef.current && errors.values?.[valueIndex]) {
      setIsCollapsed(false);
    }
    previousSubmitCountRef.current = submitCount;
  }, [submitCount, errors, valueIndex]);

  return (
    <VStack
      ref={setNodeRef}
      // @dnd-kit recommends inline style (not sx) to avoid CSS-in-JS overhead during drag.
      // transform: positional offset while dragging; transition: smooth slide animation after drop.
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      sx={{
        border: `1px solid ${palette.primary.light20}`,
        borderRadius: 2,
        overflow: 'hidden',
        opacity: isDragging ? 0.5 : 1,
        p: 6,
        gap: 5,
      }}
      data-testid={`value-card-${valueIndex}`}
    >
      <ValueCardHeader
        valueIndex={valueIndex}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isDragging={isDragging}
        attributes={attributes}
        listeners={listeners}
        nameField={nameField}
        nameError={nameError}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      />

      <Collapse in={!isCollapsed}>
        <VStack sx={{ gap: 4 }}>
          {scopeFields.length > 0 ? (
            scopeFields.map((scopeField, scopeIndex) => (
              <LumiTagDataSourceBlock
                key={scopeField.id}
                valueIndex={valueIndex}
                scopeIndex={scopeIndex}
                platform={scopeField.platform}
                onRemove={() => removeScope(scopeIndex)}
              />
            ))
          ) : (
            <Box id={`values.${valueIndex}.scopes`}>
              <LumiTagEmptyState hasError={Boolean(scopesErrorMessage)} />
            </Box>
          )}

          <HStack sx={{ alignItems: 'center', gap: 3 }}>
            <AddDataSourceButton
              availablePlatforms={availablePlatforms}
              valueIndex={valueIndex}
              onSelect={addScope}
            />
            {scopesErrorMessage && (
              <Typography
                variant="body2"
                color="error"
                data-testid={`scopes-required-error-${valueIndex}`}
              >
                {scopesErrorMessage}
              </Typography>
            )}
          </HStack>
        </VStack>
      </Collapse>
    </VStack>
  );
}
