import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

import { Box, ClickAwayListener, Popper, Tooltip, Typography } from '@mui/material';

import { InputLabel } from '../../Input/InputLabel';
import { useMergeRefs } from '@shared/hooks';

import { VStack } from '../../Stack';
import { SelectButton } from '../SelectButton';
import { SelectMenuWrapper } from '../SelectMenuWrapper';
import type { MultiSelectProps, Option } from './multiSelect.types';
import { MultiSelectMenu } from './MultiSelectMenu';

const MAX_TOOLTIP_ITEMS = 5;

const LABELS = {
  getDefaultSearchPlaceholder: (label: string) => `Search ${label.toLowerCase()}`,
  getDisplayValue: (selectedLength: number, optionsLength: number) =>
    `${selectedLength} of ${optionsLength} Selected`,
  getMoreSuffix: (remaining: number) => `...+${remaining} more, view full list in dropdown list.`,
};

const getSelectedStatus = <T,>({
  selectedIdsSet,
  filteredOptions,
}: {
  selectedIdsSet: Set<T>;
  filteredOptions: Option<T>[];
}) => {
  const allSelected = filteredOptions.every((_option) => selectedIdsSet.has(_option.id));
  const someSelected = allSelected
    ? true
    : filteredOptions.some((_option) => selectedIdsSet.has(_option.id));

  return {
    isChecked: allSelected,
    isIndeterminate: someSelected && !allSelected,
  };
};

export function MultiSelect<T = string>({
  configKey,
  label = '',
  value: selectedIds,
  options,
  isLoading = false,
  onChange,
  defaultDisplayLabel = '',
  selectPlaceholder = '',
  searchPlaceholder,
  showSelectAllOption,
  wrapperSx,
  disabled = false,
  handleClose: handleCloseProps,
  helperText,
  required = false,
  labelTooltipText,
  showSelectedValuesTooltip = false,
  dataTestId,
  ref,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const buttonRef = useMergeRefs(ref, setAnchorEl);

  const filteredOptions = options.filter((option) => {
    const checkItems = [option.desc || '', option.name || ''];
    return checkItems.some((_text) => _text.toLowerCase().includes(inputValue.toLowerCase()));
  });

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectAllOptionStatus = getSelectedStatus<T>({
    selectedIdsSet,
    filteredOptions,
  });

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value.trim());
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setInputValue('');
    // 調用外部傳入的 handleClose
    handleCloseProps?.();
  }, [handleCloseProps]);

  const handleToggleSelect = useCallback(
    (item: Option<T>) => {
      const itemId = item.id;
      const newSelectedIds = selectedIdsSet.has(itemId)
        ? selectedIds.filter((id) => id !== itemId)
        : [...selectedIds, itemId];

      // 立即觸發 onChange
      onChange?.({
        key: configKey,
        value: newSelectedIds,
      });
    },
    [selectedIds, selectedIdsSet, onChange, configKey]
  );

  const handleToggleSelectAll = useCallback(() => {
    const filteredOptionIds = filteredOptions.map((option) => option.id);
    const filteredOptionIdsSet = new Set(filteredOptionIds);

    const newSelectedIds =
      selectAllOptionStatus.isChecked || selectAllOptionStatus.isIndeterminate
        ? // unselect all: current selected options - filtered options (remove overlap)
          selectedIds.filter((id) => !filteredOptionIdsSet.has(id))
        : // select all: add all filtered options to current selected options
          Array.from(new Set([...selectedIds, ...filteredOptionIds]));

    // 立即觸發 onChange
    onChange?.({
      key: configKey,
      value: newSelectedIds,
    });
  }, [selectAllOptionStatus, filteredOptions, selectedIds, onChange, configKey]);

  const displayValue = (() => {
    const selectedLength = selectedIds.length || 0;
    const optionsLength = options.length || 0;

    if (selectedLength === 0) return defaultDisplayLabel;
    return LABELS.getDisplayValue(selectedLength, optionsLength);
  })();

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const menuWidth =
    anchorEl?.offsetWidth && anchorEl.offsetWidth > 400 ? anchorEl.offsetWidth : 400;

  const selectedValuesTooltipContent = (() => {
    if (!showSelectedValuesTooltip || selectedIds.length === 0) return null;
    const selectedOptions = options.filter((option) => selectedIdsSet.has(option.id));
    const displayed = selectedOptions.slice(0, MAX_TOOLTIP_ITEMS);
    const remaining = selectedOptions.length - displayed.length;
    return (
      <Box>
        <Box component="ul" sx={{ m: 0, pl: 6, listStyleType: 'disc' }}>
          {displayed.map((option) => (
            <li key={String(option.id)}>
              <Typography variant="body1">{option.name}</Typography>
            </li>
          ))}
        </Box>
        {remaining > 0 && (
          <Typography variant="body1">{LABELS.getMoreSuffix(remaining)}</Typography>
        )}
      </Box>
    );
  })();

  const selectButton = (
    <SelectButton
      ref={buttonRef}
      isOpen={isOpen}
      value={displayValue}
      placeholder={selectPlaceholder}
      disabled={disabled}
      onClick={handleOpen}
      helperText={helperText}
    />
  );

  return (
    <VStack
      flexWrap="nowrap"
      gap={1}
      sx={{ ...wrapperSx }}
      data-testid={dataTestId ?? 'multi-select'}
    >
      {label && (
        <InputLabel
          label={
            <Typography variant="captionBold" color="primary.main">
              {label}
            </Typography>
          }
          required={required}
          tooltipText={labelTooltipText}
        />
      )}
      {selectedValuesTooltipContent ? (
        <Tooltip
          title={selectedValuesTooltipContent}
          slotProps={{ tooltip: { sx: { width: 368, maxWidth: 368 } } }}
        >
          <Box>{selectButton}</Box>
        </Tooltip>
      ) : (
        selectButton
      )}
      {isOpen && (
        <ClickAwayListener onClickAway={handleClose}>
          <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-end" sx={{ zIndex: 2000 }}>
            <SelectMenuWrapper>
              <MultiSelectMenu<T>
                width={menuWidth}
                searchPlaceholder={searchPlaceholder || LABELS.getDefaultSearchPlaceholder(label)}
                searchInputValue={inputValue}
                onSearchChange={handleInputChange}
                isLoading={isLoading}
                options={filteredOptions}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                selectAllOptionStatus={selectAllOptionStatus}
                showSelectAllOption={showSelectAllOption}
              />
            </SelectMenuWrapper>
          </Popper>
        </ClickAwayListener>
      )}
    </VStack>
  );
}
