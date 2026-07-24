import { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import { ClickAwayListener, Popper, Typography } from '@mui/material';

import { InputLabel } from '../../Input/InputLabel';
import { useMergeRefs } from '@shared/hooks';

import { VStack } from '../../Stack';
import { SelectButton } from '../SelectButton';
import { SelectMenuWrapper } from '../SelectMenuWrapper';
import { UNGROUPED_KEY } from './constants';
import type {
  GroupData,
  GroupedMultiSelectProps,
  GroupOption,
  SelectedData,
} from './groupedMultiSelect.types';
import { GroupedMultiSelectMenu } from './GroupedMultiSelectMenu';

const LABELS = {
  getDefaultSearchPlaceholder: (label: string) => `Search ${label.toLowerCase()}`,
  getDisplayValue: (selectedLength: number, optionsLength: number) =>
    `${selectedLength} of ${optionsLength} Selected`,
};

const getSelectedValuesByGroupKey = (selectedData: SelectedData, groupKey: string): string[] =>
  selectedData.find((group) => group.key === groupKey)?.values ?? [];

const filterOptions = (data: GroupData, searchValue: string): GroupData => {
  const keyword = searchValue.trim().toLowerCase();
  if (!keyword) return data;

  const matches = (text: string) => text.toLowerCase().includes(keyword);

  return data
    .map((group) => {
      // 群組名稱命中 → 整組保留
      if (group.key !== UNGROUPED_KEY && matches(group.displayKey ?? '')) return group;
      // 否則只留下名稱命中的 values
      return { ...group, values: group.values.filter((value) => matches(value.name)) };
    })
    .filter((group) => group.values.length > 0);
};

const getTotalSelectedCount = (selectedData: SelectedData): number =>
  selectedData.reduce((total, group) => total + group.values.length, 0);

const getTotalCount = (data: GroupData): number =>
  data.reduce((total, group) => total + group.values.length, 0);

// immutable update, 處理選取資料的更新，新增或移除選項
const updateSelectedData = (
  selectedData: SelectedData,
  groupKey: string,
  newSelected: string[]
): SelectedData => {
  // 移除 newSelected 所屬的群組，保留其他群組
  const otherGroups = selectedData.filter((group) => group.key !== groupKey);

  // 如果 newSelected 有值，則重新加入群組並回傳，否則只回傳其他群組
  return newSelected.length > 0
    ? [...otherGroups, { key: groupKey, values: newSelected }]
    : otherGroups;
};

const getSelectionStatus = (allValues: GroupOption[], selectedValues: string[]) => {
  if (allValues.length === 0) return { allSelected: false, someSelected: false };

  const allValueIds = allValues.map((value) => value.id);
  const selectedInFiltered = allValueIds.filter((id) => selectedValues.includes(id));
  const allSelected = selectedInFiltered.length === allValueIds.length;
  const someSelected = selectedInFiltered.length > 0 && !allSelected;

  return { allSelected, someSelected };
};

export const GroupedMultiSelect = memo(
  forwardRef<HTMLElement, GroupedMultiSelectProps>(function GroupedMultiSelect(
    {
      data,
      defaultDisplayValue = '',
      disabled = false,
      handleClose: handleCloseProps,
      isLoading = false,
      label = '',
      onChange,
      required = false,
      searchPlaceholder,
      selectPlaceholder = '',
      value: selectedData,
      wrapperSx,
      dataTestId,
      labelTooltipText,
      defaultExpanded = true,
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const buttonRef = useMergeRefs(ref, setAnchorEl);

    // 處理資料：過濾和排序
    const processedData = useMemo(() => {
      const filtered = filterOptions(data, searchValue);
      return filtered.sort((a, b) => {
        if (a.key === UNGROUPED_KEY && b.key !== UNGROUPED_KEY) return -1;
        if (a.key !== UNGROUPED_KEY && b.key === UNGROUPED_KEY) return 1;
        return 0;
      });
    }, [data, searchValue]);

    // 計算全選狀態
    const allSelectStatus = useMemo(() => {
      const allValues = processedData.flatMap((group) => group.values);
      const allSelectedValues = selectedData.flatMap((group) => group.values);
      const { allSelected, someSelected } = getSelectionStatus(allValues, allSelectedValues);

      return { isChecked: allSelected, isIndeterminate: someSelected };
    }, [processedData, selectedData]);

    const totalSelectedCount = useMemo(() => getTotalSelectedCount(selectedData), [selectedData]);
    const totalCount = useMemo(() => getTotalCount(data), [data]);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value.trim());
    }, []);

    /**
     * 處理單個選項的選取/取消選取
     */
    const handleToggleSelect = useCallback(
      (groupKey: string, optionId: string) => {
        const currentSelected = getSelectedValuesByGroupKey(selectedData, groupKey);
        const newSelected = currentSelected.includes(optionId)
          ? currentSelected.filter((id) => id !== optionId) // 取消選取
          : [...currentSelected, optionId]; // 新增選取

        const newSelectedData = updateSelectedData(selectedData, groupKey, newSelected);
        onChange?.(newSelectedData);
      },
      [selectedData, onChange]
    );

    /**
     * 處理群組的全選/取消全選
     */
    const handleToggleGroupSelect = useCallback(
      (groupKey: string) => {
        const group = processedData.find((g) => g.key === groupKey);
        const groupValues = group?.values ?? [];
        const groupValueIds = groupValues.map((v) => v.id);

        const currentSelected = getSelectedValuesByGroupKey(selectedData, groupKey);
        const { allSelected, someSelected } = getSelectionStatus(groupValues, currentSelected);

        // eslint-disable-next-line @typescript-eslint/init-declarations
        let newSelected: string[];
        if (allSelected || someSelected) {
          // 取消全選：只移除搜索結果中的選項，保留其他已選擇項目
          newSelected = currentSelected.filter((id) => !groupValueIds.includes(id));
        } else {
          // 全選：將搜索結果中的所有選項加入到現有選項中
          newSelected = Array.from(new Set([...currentSelected, ...groupValueIds]));
        }

        onChange?.(updateSelectedData(selectedData, groupKey, newSelected));
      },
      [processedData, selectedData, onChange]
    );

    /**
     * 處理全選/取消全選
     */
    const handleToggleSelectAll = useCallback(() => {
      const allFilteredValues = processedData.flatMap((group) => group.values);
      const allSelectedValues = selectedData.flatMap((group) => group.values);

      const { allSelected, someSelected } = getSelectionStatus(
        allFilteredValues,
        allSelectedValues
      );

      let newSelectedData = [...selectedData];

      for (const group of processedData) {
        const currentSelected = getSelectedValuesByGroupKey(newSelectedData, group.key);
        const groupValues = group.values;
        const groupValueIds = groupValues.map((v) => v.id);

        // eslint-disable-next-line @typescript-eslint/init-declarations
        let newSelected: string[];
        if (allSelected || someSelected) {
          // 取消選取：移除搜尋結果中的選項
          newSelected = currentSelected.filter((id) => !groupValueIds.includes(id));
        } else {
          // 全選：加入搜尋結果中的所有選項
          newSelected = Array.from(new Set([...currentSelected, ...groupValueIds]));
        }

        newSelectedData = updateSelectedData(newSelectedData, group.key, newSelected);
      }

      onChange?.(newSelectedData);
    }, [processedData, selectedData, onChange]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      setSearchValue('');
      // 調用外部傳入的 handleClose
      handleCloseProps?.();
    }, [handleCloseProps]);

    const displayValue = (() => {
      if (totalSelectedCount === 0) {
        return defaultDisplayValue;
      }
      return LABELS.getDisplayValue(totalSelectedCount, totalCount);
    })();

    const handleOpen = () => {
      if (!disabled) {
        setIsOpen(true);
      }
    };

    const menuWidth =
      anchorEl?.offsetWidth && anchorEl.offsetWidth > 400 ? anchorEl.offsetWidth : 400;

    return (
      <VStack
        flexWrap="nowrap"
        sx={{ gap: 0.5, ...wrapperSx }}
        data-testid={dataTestId ?? 'grouped-multi-select'}
      >
        {label && (
          <InputLabel
            label={
              <Typography variant="captionBold" color="primary.main">
                {label}
              </Typography>
            }
            required={required}
            rootSx={{ marginBottom: '4px' }}
            tooltipText={labelTooltipText}
          />
        )}
        <SelectButton
          ref={buttonRef}
          isOpen={isOpen}
          value={displayValue}
          placeholder={selectPlaceholder}
          disabled={disabled}
          onClick={handleOpen}
        />
        {isOpen && (
          <ClickAwayListener onClickAway={handleClose}>
            <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-end" sx={{ zIndex: 2000 }}>
              <SelectMenuWrapper>
                <GroupedMultiSelectMenu
                  width={menuWidth}
                  searchPlaceholder={searchPlaceholder || LABELS.getDefaultSearchPlaceholder(label)}
                  searchInputValue={searchValue}
                  onSearchChange={handleSearchChange}
                  isLoading={isLoading}
                  data={processedData}
                  selectedData={selectedData}
                  allSelectStatus={allSelectStatus}
                  onToggleSelect={handleToggleSelect}
                  onToggleGroupSelect={handleToggleGroupSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  defaultExpanded={defaultExpanded}
                />
              </SelectMenuWrapper>
            </Popper>
          </ClickAwayListener>
        )}
      </VStack>
    );
  })
);
