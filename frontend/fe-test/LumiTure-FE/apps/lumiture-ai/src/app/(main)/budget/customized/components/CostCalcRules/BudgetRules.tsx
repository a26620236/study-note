import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { MaterialSymbol } from 'material-symbols';
import { useFormContext } from 'react-hook-form';

import { Button, DropdownButton, Icon } from '@lumiture-ui';

import {
  FORM_ID,
  getPlatformConditionOption,
} from '@app/(main)/budget/customized/components/constants';
import Condition from '@app/(main)/budget/customized/components/CostCalcRules/Condition';
import PlatformSelect from '@app/(main)/budget/customized/components/CostCalcRules/PlatformSelect';
import {
  ConditionFieldName,
  type CustomBudgetForm,
} from '@app/(main)/budget/customized/components/types';

interface ActionButton {
  name: MaterialSymbol;
  fill: boolean;
  tooltip: string;
  onClick: () => void;
}

interface BudgetRulesProps {
  ruleIndex: number;
  onDelete: () => void;
  onCopy: () => void;
}

const BudgetRules = ({ ruleIndex, onDelete, onCopy }: BudgetRulesProps) => {
  const [fieldOrder, setFieldOrder] = useState<ConditionFieldName[]>([]);
  const { setValue, watch } = useFormContext<CustomBudgetForm>();
  const rules = watch(FORM_ID.RULES);

  const platform = rules[ruleIndex]?.platform;

  const conditions = Object.entries({
    [ConditionFieldName.PROJECTS]: rules[ruleIndex].projects,
    [ConditionFieldName.SERVICES]: rules[ruleIndex].services,
    [ConditionFieldName.GROUPS]: rules[ruleIndex].groups,
  })
    .map(([key, value]) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      fieldName: key as ConditionFieldName,
      value,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      order: fieldOrder.indexOf(key as ConditionFieldName),
    }))
    .filter((_option) => _option.value)
    .sort((a, b) => a.order - b.order);

  const isFullCondition = conditions.length >= Object.keys(ConditionFieldName).length;

  const handleAddCondition = (fieldName: ConditionFieldName) => {
    const currentRule = rules[ruleIndex];
    setValue(`${FORM_ID.RULES}.${ruleIndex}`, {
      ...currentRule,
      [fieldName]: [],
    });
    setFieldOrder((prev) => [...prev, fieldName]);
  };

  const handleDeleteCondition = (fieldName: ConditionFieldName) => {
    const currentRule = rules[ruleIndex];
    setValue(`${FORM_ID.RULES}.${ruleIndex}`, {
      ...currentRule,
      [fieldName]: null,
    });
    setFieldOrder((_prev) => _prev.filter((_fieldName) => _fieldName !== fieldName));
  };

  const conditionOptions = Object.values(ConditionFieldName).map((fieldName) => {
    const option = getPlatformConditionOption(fieldName, platform);
    return {
      ...option,
      onClick: handleAddCondition,
      disabled:
        conditions.findIndex(
          (_condition) => _condition.value && _condition.fieldName === fieldName
        ) !== -1,
    };
  });

  const actionButtons: ActionButton[] = [
    { name: 'delete', onClick: onDelete, fill: true, tooltip: 'Remove' },
    { name: 'content_copy', onClick: onCopy, fill: true, tooltip: 'Duplicate' },
  ];

  return (
    <Stack direction="row" spacing={4} alignItems="center">
      <Stack
        bgcolor="background.page"
        gap={4}
        sx={{
          flex: 1,
          p: 4,
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'primary.light20',
        }}
      >
        {/* platform select */}
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>All</Typography>
          <PlatformSelect ruleIndex={ruleIndex} />
          <Typography>resources assigned to the groups you have permissions for</Typography>
        </Stack>
        {conditions.map((_condition, _conditionIndex) => (
          <Condition
            key={_condition.fieldName}
            conditionIndex={_conditionIndex}
            ruleIndex={ruleIndex}
            fieldName={_condition.fieldName}
            platform={rules[ruleIndex].platform}
            onDelete={handleDeleteCondition}
          />
        ))}
        <Stack sx={{ width: 'fit-content' }}>
          <DropdownButton
            button={
              <Tooltip
                title={isFullCondition && 'You have reached the limit.'}
                placement="bottom-start"
              >
                <span>
                  <Button
                    variant="text"
                    startIcon={<Icon name="add_circle" fill={true} />}
                    disabled={isFullCondition}
                  >
                    Add Condition
                  </Button>
                </span>
              </Tooltip>
            }
            disabled={isFullCondition}
            list={conditionOptions}
            placement="bottom-start"
          />
        </Stack>
      </Stack>
      <Stack spacing={4}>
        {actionButtons.map((_button) => (
          <Tooltip title={_button.tooltip} key={_button.name}>
            <IconButton onClick={_button.onClick}>
              <Icon name={_button.name} fill={_button.fill} />
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
};

export default BudgetRules;
