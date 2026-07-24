import { useCallback, useEffect, useRef, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format, subYears } from 'date-fns';
import { upperFirst } from 'lodash-es';
import { useFormContext } from 'react-hook-form';

import { Icon } from '@lumiture-ui';

import {
  CUSTOM_ERROR_TYPE,
  FORM_ID,
  getPlatformApiFieldName,
  getPlatformConditionOption,
} from '@app/(main)/budget/customized/components/constants';
import ChipsSelect from '@app/(main)/budget/customized/components/CostCalcRules/ChipsSelect';
import RuleSelect from '@app/(main)/budget/customized/components/CostCalcRules/RuleSelect';
import {
  ConditionFieldName,
  type AvailablePlatform,
  type BatchCreateConditionFieldName,
  type CustomBudgetForm,
  type RenderConditionInput,
} from '@app/(main)/budget/customized/components/types';
import { useLegacyGetPlatformFilterOptions } from '@hooks-api';

import type { DateString, FilterOption } from '../../types/customizedBudget';

const SelectedRule = styled(Typography)(({ theme }) => ({
  width: 'fit-content',
  height: 36,
  padding: '0 8px',
  lineHeight: '32px',
  textAlign: 'center',
  backgroundColor: theme.palette.white.main,
  borderRadius: '5px',
  border: '1px solid',
  borderColor: theme.palette.gray.border,
}));

interface ConditionProps {
  conditionIndex: number;
  ruleIndex: number;
  fieldName: ConditionFieldName;
  platform: AvailablePlatform;
  onDelete: (fieldName: ConditionFieldName) => void;
}

const Condition = ({
  conditionIndex,
  ruleIndex,
  fieldName,
  platform,
  onDelete,
}: ConditionProps) => {
  const [invalidItemIds, setInvalidItemIds] = useState<string[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const isFirst = conditionIndex === 0;

  useEffect(() => {
    if (selectContainerRef.current) {
      setContainerWidth(selectContainerRef.current.offsetWidth);
    }
  }, []);

  const {
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,

    formState: { isSubmitting },
  } = useFormContext<CustomBudgetForm>();
  const rules = watch(FORM_ID.RULES);

  const selectedValues = rules[ruleIndex]?.[fieldName] ?? [];
  const error = errors.rules?.[ruleIndex]?.[fieldName];

  const results = useLegacyGetPlatformFilterOptions({
    platforms: [platform],
    params: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      start_date: format(subYears(new Date(), 1), 'yyyy-MM-dd') as DateString,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      end_date: format(new Date(), 'yyyy-MM-dd') as DateString,
    },
  });

  const [{ data, isLoading }] = results;

  // 根據平台取得對應的 API 欄位名稱
  // AWS: accounts, GCP: projects, Azure: resourceGroups
  const apiFieldName = getPlatformApiFieldName(fieldName, platform);

  const options = (() => {
    if (fieldName === ConditionFieldName.PROJECTS) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      return (data?.[apiFieldName as keyof typeof data] ?? []) as FilterOption[];
    }
    return data?.[fieldName] ?? [];
  })();

  // if selected item id is not in options, it will be invalid
  useEffect(() => {
    if (isLoading || !selectedValues.length) return;

    const invalidIds = selectedValues
      .filter((_item) => options.findIndex((_option) => _item.id === _option.id) === -1)
      .map((_item) => _item.id);

    setInvalidItemIds((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(invalidIds)) return prev;
      return invalidIds;
    });

    const errorPath = `${FORM_ID.RULES}.${ruleIndex}.${fieldName}` as const;

    if (invalidIds.length > 0) {
      setError(errorPath, {
        type: CUSTOM_ERROR_TYPE.INVALID_IDS,
        message: 'This condition contains invalid or deleted items.',
      });
    } else {
      clearErrors(errorPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues, options, ruleIndex, fieldName, setError, setValue, isSubmitting]);

  const handleInputChange = useCallback(
    ({
      fieldName,
      value,
    }: {
      fieldName: ConditionFieldName | BatchCreateConditionFieldName;
      value: FilterOption[];
    }) => {
      const currentRule = rules[ruleIndex];
      setValue(`${FORM_ID.RULES}.${ruleIndex}`, {
        ...currentRule,
        [fieldName]: value,
      });
    },
    [ruleIndex, rules, setValue]
  );

  const handleRemoveInvalidItems = () => {
    handleInputChange({
      fieldName,
      value: selectedValues.filter((_item) => !invalidItemIds.includes(_item.id)),
    });
  };

  const handleDeleteChip = (id: FilterOption['id']) => {
    const newValues = selectedValues.filter((item) => item.id !== id);
    handleInputChange({
      fieldName,
      value: newValues,
    });
  };

  const handleResetChips = () => {
    handleInputChange({
      fieldName,
      value: [],
    });
  };

  const renderInput: RenderConditionInput = ({ isOpen, fieldName }) => {
    const items =
      fieldName === ConditionFieldName.PROJECTS
        ? selectedValues.map((_item) => ({ ..._item, name: `${_item.name}(${_item.id})` }))
        : selectedValues;

    // 根據平台顯示正確的 placeholder
    const label = getPlatformConditionOption(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      fieldName as ConditionFieldName,
      platform
    ).label.toLowerCase();
    const placeholder = `Select ${label}`;

    return (
      <ChipsSelect
        isOpen={isOpen}
        placeholder={placeholder}
        selectedItems={items}
        invalidItemIds={invalidItemIds}
        onDelete={handleDeleteChip}
        onReset={handleResetChips}
        isError={Boolean(error)}
      />
    );
  };

  const renderPropertySelect = () =>
    upperFirst(getPlatformConditionOption(fieldName, platform).label);

  return (
    <Stack direction="row" alignItems="start" gap={2}>
      <Typography sx={{ width: 36, textAlign: 'right', mt: 1 }}>
        {isFirst ? 'Where' : 'And'}
      </Typography>
      <SelectedRule>{renderPropertySelect()}</SelectedRule>
      <Typography sx={{ mt: 1 }}>is in</Typography>
      <Stack sx={{ flex: 1 }} spacing={1} ref={selectContainerRef}>
        <RuleSelect
          menuWidth={containerWidth}
          fieldName={fieldName}
          value={selectedValues}
          options={options}
          isLoading={isLoading}
          renderInput={renderInput}
          onChange={handleInputChange}
        />
        {/* general error message */}
        {error && error.type !== CUSTOM_ERROR_TYPE.INVALID_IDS && (
          <Typography color="error">{error.message}</Typography>
        )}
        {/* invalid id error message */}
        {error?.type === CUSTOM_ERROR_TYPE.INVALID_IDS && (
          <Typography color="error">
            {error.message} Click{' '}
            <Typography
              onClick={handleRemoveInvalidItems}
              component="span"
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              here{' '}
            </Typography>
            to remove them.
          </Typography>
        )}
      </Stack>
      <Tooltip title="Remove" sx={{ mt: 1.5 }}>
        <IconButton onClick={() => onDelete(fieldName)}>
          <Icon name="remove" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default Condition;
