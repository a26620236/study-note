import { useCallback, useEffect, useRef, useState } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { FORM_ID } from '@app/(main)/budget/customized/components/constants';
import ChipsSelect from '@app/(main)/budget/customized/components/CostCalcRules/ChipsSelect';
import RuleSelect from '@app/(main)/budget/customized/components/CostCalcRules/RuleSelect';
import {
  BatchCreateConditionFieldName,
  type CustomBudgetBatchForm,
  type RenderConditionInput,
} from '@app/(main)/budget/customized/components/types';
import { PlatformsValue } from '@constants';
import { useLegacyGetPlatformFilterOptions } from '@hooks-api';

import type { DateString, FilterOption } from '../../types/customizedBudget';

interface GroupsSelectProps {
  platforms: PlatformsValue[];
}

const getBatchCreateConditionFieldByPlatform = (
  platform: PlatformsValue
): BatchCreateConditionFieldName => {
  switch (platform) {
    case PlatformsValue.GCP:
      return BatchCreateConditionFieldName.PROJECTS;
    case PlatformsValue.AWS:
      return BatchCreateConditionFieldName.ACCOUNTS;
    case PlatformsValue.AZURE:
      return BatchCreateConditionFieldName.ResourcesGroups;
  }
};

const mergeArraysWithUniqueIds = (arrs: FilterOption[][]): FilterOption[] => {
  const flatArr = arrs.flat();
  const uniqueMap = new Map(flatArr.map((item) => [item.id, item]));
  return Array.from(uniqueMap.values());
};

const GroupsSelect = ({ platforms }: GroupsSelectProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const selectContainerRef = useRef<HTMLDivElement>(null);

  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CustomBudgetBatchForm>();
  const groups = watch(`${FORM_ID.ALERT}.values`);

  const errorMsg = errors[FORM_ID.ALERT]?.values?.message;

  const results = useLegacyGetPlatformFilterOptions({
    platforms,
    params: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      start_date: format(new Date(), 'yyyy-MM-dd') as DateString,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      end_date: format(new Date(), 'yyyy-MM-dd') as DateString,
    },
  });
  const conditionField =
    platforms.length === 1
      ? getBatchCreateConditionFieldByPlatform(platforms[0])
      : BatchCreateConditionFieldName.GROUPS;
  const isLoading = results.some((query) => query.isLoading);
  const options = isLoading
    ? []
    : mergeArraysWithUniqueIds(results.map((query) => query.data?.[conditionField] ?? []));

  const handleInputChange = useCallback(
    ({ value }: { value: FilterOption[] }) => {
      setValue(`${FORM_ID.ALERT}.values`, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const handleDeleteChip = (id: FilterOption['id']) => {
    const newValues = groups.filter((_group) => _group.id !== id);
    handleInputChange({
      value: newValues,
    });
  };

  const handleResetChips = () => {
    handleInputChange({
      value: [],
    });
  };

  const renderInput: RenderConditionInput = ({ isOpen, fieldName }) => (
    <ChipsSelect
      isOpen={isOpen}
      placeholder={`Selected ${fieldName}`}
      selectedItems={groups}
      invalidItemIds={[]}
      onDelete={handleDeleteChip}
      onReset={handleResetChips}
      isError={!!errorMsg}
    />
  );

  useEffect(() => {
    if (selectContainerRef.current) {
      setContainerWidth(selectContainerRef.current.offsetWidth);
    }
  }, []);

  const formatFieldName = (fieldName: string) =>
    fieldName
      .replace(/([A-Z])/gu, ' $1') // 在大寫字母前加空格
      .replace(/^./u, (str) => str.toUpperCase()) // 首字母大寫
      .trim();

  return (
    <FormControl ref={selectContainerRef}>
      <InputLabel size="small" required>
        {formatFieldName(conditionField)}
      </InputLabel>
      <RuleSelect
        menuWidth={containerWidth}
        fieldName={conditionField}
        value={groups}
        options={options}
        isLoading={isLoading}
        renderInput={renderInput}
        onChange={handleInputChange}
      />
      {errorMsg && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {errorMsg}
        </Typography>
      )}
    </FormControl>
  );
};

export default GroupsSelect;
