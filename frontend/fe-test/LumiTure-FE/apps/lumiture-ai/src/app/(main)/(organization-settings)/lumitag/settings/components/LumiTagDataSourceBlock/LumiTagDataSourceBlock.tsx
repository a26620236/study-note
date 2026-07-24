'use client';

import { Button, Icon, VStack } from '@lumiture-ui';
import { palette } from '@lumiture-ui/theme';

import type { PlatformsValue } from '@constants';

import { MAX_CONDITIONS } from '../../constants/lumiTagSettings';
import { useConditionArrayField } from '../../hooks/useConditionArrayField';
import { LumiTagConditionRow } from '../LumiTagConditionRow/LumiTagConditionRow';
import { DataSourceBlockHeader } from './DataSourceBlockHeader';

interface LumiTagDataSourceBlockProps {
  valueIndex: number;
  scopeIndex: number;
  platform: PlatformsValue;
  onRemove: () => void;
}

const LABELS = {
  addCondition: 'Add Condition',
  maxConditionsTooltip: `Maximum ${MAX_CONDITIONS} conditions per data source`,
};

interface AddConditionButtonProps {
  valueIndex: number;
  scopeIndex: number;
  canAddMore: boolean;
  onAdd: () => void;
}

function AddConditionButton({
  valueIndex,
  scopeIndex,
  canAddMore,
  onAdd,
}: AddConditionButtonProps) {
  return (
    <Button
      variant="text"
      size="small"
      startIcon={<Icon name="add" />}
      onClick={onAdd}
      disabled={!canAddMore}
      tooltipProps={
        canAddMore ? undefined : { title: LABELS.maxConditionsTooltip, placement: 'top' }
      }
      sx={{ alignSelf: 'flex-start', mt: 0.5 }}
      data-testid={`add-condition-${valueIndex}-${scopeIndex}`}
    >
      {LABELS.addCondition}
    </Button>
  );
}

export function LumiTagDataSourceBlock({
  valueIndex,
  scopeIndex,
  platform,
  onRemove,
}: LumiTagDataSourceBlockProps) {
  const { fields, appendCondition, removeCondition, canAddMore } = useConditionArrayField(
    valueIndex,
    scopeIndex
  );

  return (
    <VStack
      sx={{
        border: `1px solid ${palette.primary.light20}`,
        backgroundColor: palette.primary.light10,
        borderRadius: '8px',
        p: 4,
        gap: 5,
      }}
      data-testid={`data-source-block-${valueIndex}-${scopeIndex}`}
    >
      <DataSourceBlockHeader
        valueIndex={valueIndex}
        scopeIndex={scopeIndex}
        platform={platform}
        onRemove={onRemove}
      />

      {fields.map((field, conditionIndex) => (
        <LumiTagConditionRow
          key={field.id}
          valueIndex={valueIndex}
          scopeIndex={scopeIndex}
          conditionIndex={conditionIndex}
          isFirst={conditionIndex === 0}
          platform={platform}
          onRemove={() => removeCondition(conditionIndex)}
        />
      ))}

      <AddConditionButton
        valueIndex={valueIndex}
        scopeIndex={scopeIndex}
        canAddMore={canAddMore}
        onAdd={() => appendCondition(platform)}
      />
    </VStack>
  );
}
