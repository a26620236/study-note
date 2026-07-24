import { memo, useCallback, useState } from 'react';

import { DropdownButton, MultiSelectMenu } from '@lumiture-ui';

import type {
  BatchCreateConditionFieldName,
  ConditionFieldName,
  RenderConditionInput,
} from '@app/(main)/budget/customized/components/types';

import type { FilterOption } from '../../types/customizedBudget';

const getSelectedStatus = ({
  selectedIds,
  filteredOptions,
}: {
  selectedIds: string[];
  filteredOptions: FilterOption[];
}) => {
  const allSelected = filteredOptions.every((_option) => selectedIds.includes(_option.id));
  const someSelected = filteredOptions.some((_option) => selectedIds.includes(_option.id));

  return {
    // all filtered options are selected
    isChecked: allSelected,
    // some filtered options are selected, but not all
    isIndeterminate: someSelected && !allSelected,
  };
};

interface RuleSelectProps {
  menuWidth?: number | string;
  fieldName: ConditionFieldName | BatchCreateConditionFieldName;
  value: FilterOption[];
  options: FilterOption[];
  isLoading?: boolean;
  renderInput?: RenderConditionInput;
  onChange: ({
    fieldName,
    value,
  }: {
    fieldName: ConditionFieldName | BatchCreateConditionFieldName;
    value: FilterOption[];
  }) => void;
}

const RuleSelect = ({
  menuWidth,
  fieldName,
  value: selectedItems,
  options,
  isLoading = false,
  renderInput,
  onChange,
}: RuleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  const selectedIds = selectedItems.map((_item) => _item.id);

  const filteredOptions = options.filter((option) => {
    const checkItems = [option.desc || '', option.name || ''];
    return checkItems.some((_text) => _text.toLowerCase().includes(searchInputValue.toLowerCase()));
  });

  const selectAllOptionStatus = getSelectedStatus({ selectedIds, filteredOptions });

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value.trim());
  }, []);

  const handleToggleSelect = useCallback(
    (item: FilterOption) => {
      const itemId = item.id;
      onChange({
        fieldName,
        value:
          selectedItems.findIndex((_item) => _item.id === itemId) === -1
            ? [...selectedItems, item]
            : selectedItems.filter((_item) => _item.id !== itemId),
      });
    },
    [selectedItems, fieldName, onChange]
  );

  const handleToggleSelectAll = useCallback(() => {
    onChange({
      fieldName,
      value:
        selectAllOptionStatus.isChecked || selectAllOptionStatus.isIndeterminate
          ? // unselect all: current selected options - filtered options (remove overlap)
            []
          : // select all: current selected options + select all filtered options
            options.map((_option) => ({ name: _option.name, id: _option.id })),
    });
  }, [selectAllOptionStatus, fieldName, onChange, options]);

  const button = renderInput ? renderInput({ isOpen, fieldName }) : null;

  return (
    <DropdownButton
      isOpen={isOpen}
      handleOpen={() => setIsOpen(true)}
      handleClose={() => setIsOpen(false)}
      placement="bottom-end"
      button={button}
    >
      <MultiSelectMenu
        width={menuWidth}
        searchPlaceholder={`Search ${fieldName.toLowerCase()}`}
        searchInputValue={searchInputValue}
        onSearchChange={handleInputChange}
        isLoading={isLoading}
        options={filteredOptions}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        selectAllOptionStatus={selectAllOptionStatus}
      />
    </DropdownButton>
  );
};

export default memo(RuleSelect);
