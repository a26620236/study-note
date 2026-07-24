'use client';

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';

import { HStack, Icon } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';

import { isNativeTagField } from '../../constants/lumiTagFields';
import { PLATFORM_FIELD_META } from '../../constants/lumiTagSettings';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { ConditionFieldSelect } from './ConditionFieldSelect';
import { ConditionLogicSelect } from './ConditionLogicSelect';
import { ConditionOperatorSelect } from './ConditionOperatorSelect';
import { LumiTagFieldValueInput } from './LumiTagFieldValueInput';

interface ConditionIndexProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
}

function RemoveConditionButton({
  valueIndex,
  scopeIndex,
  conditionIndex,
  disabled,
  onRemove,
}: ConditionIndexProps & { disabled: boolean; onRemove: () => void }) {
  return (
    <Tooltip title={LABELS.removeCondition}>
      <span>
        <IconButton
          size="small"
          onClick={onRemove}
          disabled={disabled}
          sx={{
            '&:hover': { color: 'primary.main' },
          }}
          data-testid={`condition-remove-${valueIndex}-${scopeIndex}-${conditionIndex}`}
        >
          <Icon name="remove" sx={{ fontSize: 24 }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}

export interface LumiTagConditionRowProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
  isFirst: boolean;
  platform: PlatformsValue;
  onRemove: () => void;
}

const LABELS = {
  removeCondition: 'Remove this Value',
  where: 'Where',
  theValueOf: 'The Value of',
} as const;

export function LumiTagConditionRow({
  valueIndex,
  scopeIndex,
  conditionIndex,
  isFirst,
  platform,
  onRemove,
}: LumiTagConditionRowProps) {
  const conditionPath =
    `values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}` as const;

  const fieldValue = useWatch<LumiTagFormData, `${typeof conditionPath}.field`>({
    name: `${conditionPath}.field` as const,
  });

  const platformFields = PLATFORM_FIELD_META[platform];

  const currentFieldMeta = platformFields[fieldValue];
  const isNativeTag = isNativeTagField(currentFieldMeta.key);

  return (
    <HStack
      sx={{ gap: 2, alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
      data-testid={`condition-row-${valueIndex}-${scopeIndex}-${conditionIndex}`}
    >
      {isFirst ? (
        <Typography variant="body1" sx={{ minWidth: 56, color: 'text.primary' }}>
          {LABELS.where}
        </Typography>
      ) : (
        <ConditionLogicSelect
          valueIndex={valueIndex}
          scopeIndex={scopeIndex}
          conditionIndex={conditionIndex}
        />
      )}

      {isNativeTag && (
        <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
          {LABELS.theValueOf}
        </Typography>
      )}

      <ConditionFieldSelect
        valueIndex={valueIndex}
        scopeIndex={scopeIndex}
        conditionIndex={conditionIndex}
        platform={platform}
      />

      {!isNativeTag && (
        <Box
          id={`values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}.criteria.operator`}
        >
          <ConditionOperatorSelect
            valueIndex={valueIndex}
            scopeIndex={scopeIndex}
            conditionIndex={conditionIndex}
          />
        </Box>
      )}

      <Box
        id={`values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}.criteria.values`}
        sx={{ flex: 1, minWidth: 0 }}
      >
        <LumiTagFieldValueInput
          valueIndex={valueIndex}
          scopeIndex={scopeIndex}
          conditionIndex={conditionIndex}
          platform={platform}
          fieldMeta={currentFieldMeta}
        />
      </Box>

      <RemoveConditionButton
        valueIndex={valueIndex}
        scopeIndex={scopeIndex}
        conditionIndex={conditionIndex}
        disabled={isFirst}
        onRemove={onRemove}
      />
    </HStack>
  );
}
