'use client';

import type { useSortable } from '@dnd-kit/sortable';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import type { ControllerRenderProps, FieldError } from 'react-hook-form';

import { HStack, Icon, Input } from '@lumiture-ui';

import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';

function ValueOrderBadge({ order }: { order: number }) {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1 }}>
        {order}
      </Typography>
    </Box>
  );
}

interface ValueNameInputProps {
  valueIndex: number;
  field: ControllerRenderProps<LumiTagFormData, `values.${number}.name`>;
  error: FieldError | undefined;
}

function ValueNameInput({ valueIndex, field, error }: ValueNameInputProps) {
  return (
    <Box sx={{ flex: 1 }}>
      <Input
        {...field}
        id={field.name}
        placeholder={LABELS.valueNamePlaceholder}
        error={Boolean(error)}
        helperText={error?.message}
        sx={{ bgcolor: 'white.main', width: '100%' }}
        dataTestId={`value-name-input-${valueIndex}`}
      />
    </Box>
  );
}

export interface ValueCardHeaderProps {
  valueIndex: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDragging: boolean;
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
  nameField: ControllerRenderProps<LumiTagFormData, `values.${number}.name`>;
  nameError: FieldError | undefined;
  onDuplicate: () => void;
  onRemove: () => void;
}

const LABELS = {
  valueNamePlaceholder: 'Please enter Value Name',
  dragHandleTooltip: 'Drag to reorder priority when conditions conflict',
} as const;

export function ValueCardHeader({
  valueIndex,
  isCollapsed,
  onToggleCollapse,
  isDragging,
  attributes,
  listeners,
  nameField,
  nameError,
  onDuplicate,
  onRemove,
}: ValueCardHeaderProps) {
  return (
    <HStack sx={{ gap: 2, alignItems: 'center', flex: 1 }}>
      <IconButton
        size="medium"
        onClick={onToggleCollapse}
        data-testid={`value-collapse-${valueIndex}`}
        sx={{ color: 'text.secondary' }}
      >
        <Icon name={isCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} />
      </IconButton>

      <Tooltip title={LABELS.dragHandleTooltip}>
        <Box
          component="span"
          {...attributes}
          {...listeners}
          sx={{
            display: 'inline-flex',
            color: 'text.secondary',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <Icon name="drag_indicator" />
        </Box>
      </Tooltip>

      <ValueOrderBadge order={valueIndex + 1} />

      <ValueNameInput valueIndex={valueIndex} field={nameField} error={nameError} />

      <IconButton
        size="medium"
        onClick={onDuplicate}
        data-testid={`value-duplicate-${valueIndex}`}
        sx={{
          border: '1px solid',
          borderRadius: '5px',
          '&.MuiIconButton-sizeMedium': { width: '36px', height: '36px' },
        }}
      >
        <Icon name="content_copy" />
      </IconButton>

      <IconButton
        size="medium"
        onClick={onRemove}
        data-testid={`value-remove-${valueIndex}`}
        sx={{
          border: '1px solid',
          borderRadius: '5px',
          '&.MuiIconButton-sizeMedium': { width: '36px', height: '36px' },
        }}
      >
        <Icon name="delete" />
      </IconButton>
    </HStack>
  );
}
