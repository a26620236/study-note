import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

import { ClickAwayListener, Popper, Typography } from '@mui/material';

import { useMergeRefs } from '@shared/hooks';

import { InputLabel } from '../../Input/InputLabel';
import { VStack } from '../../Stack';
import { SelectButton } from '../SelectButton';
import { SelectMenuWrapper } from '../SelectMenuWrapper';
import type { Option } from '../SelectOptionItem';
import { UNGROUPED_KEY } from './constants';
import type {
  GroupedSingleSelectData,
  GroupedSingleSelectProps,
} from './groupedSingleSelect.types';
import { GroupedSingleSelectMenu } from './GroupedSingleSelectMenu';

const LABELS = {
  getDefaultSearchPlaceholder: (label: string) => `Search ${label.toLowerCase()}`,
};

const findSelectedOption = <T,>(
  data: GroupedSingleSelectData<T>,
  value: T | null
): Option<T> | undefined => {
  if (value === null) return undefined;
  for (const group of data) {
    const found = group.values.find((option) => option.id === value);
    if (found) return found;
  }
  return undefined;
};

const filterData = <T,>(
  data: GroupedSingleSelectData<T>,
  searchValue: string
): GroupedSingleSelectData<T> => {
  if (!searchValue.trim()) return data;
  const lower = searchValue.toLowerCase();
  return data
    .map((group) => ({
      ...group,
      values: group.values.filter((option) => {
        const checkItems = [option.desc ?? '', option.name];
        return checkItems.some((text) => text.toLowerCase().includes(lower));
      }),
    }))
    .filter((group) => group.values.length > 0);
};

const sortUngroupedFirst = <T,>(data: GroupedSingleSelectData<T>): GroupedSingleSelectData<T> =>
  [...data].sort((groupA, groupB) => {
    if (groupA.key === UNGROUPED_KEY && groupB.key !== UNGROUPED_KEY) return -1;
    if (groupA.key !== UNGROUPED_KEY && groupB.key === UNGROUPED_KEY) return 1;
    return 0;
  });

export function GroupedSingleSelect<T = string | number>({
  configKey,
  label = '',
  value,
  data,
  onChange,
  enableSearch = false,
  defaultDisplayLabel = '',
  isLoading = false,
  searchPlaceholder = '',
  selectPlaceholder = '',
  selectMenuWidth,
  defaultTags = [],
  required = false,
  sx,
  description,
  disabled = false,
  labelTooltipText,
  dataTestId,
  ref,
}: GroupedSingleSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const buttonRef = useMergeRefs(ref, setAnchorEl);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value.trim());
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setInputValue('');
  }, []);

  const processedData = useMemo(() => {
    const filtered = enableSearch ? filterData(data, inputValue) : data;
    return sortUngroupedFirst(filtered);
  }, [data, enableSearch, inputValue]);

  const selectedOption = useMemo(() => findSelectedOption(data, value), [data, value]);

  const handleSelect = useCallback(
    (item: Option<T>, groupKey: string) => {
      onChange({
        key: configKey,
        group: groupKey,
        value: item.id,
      });
      setIsOpen(false);
      setInputValue('');
    },
    [onChange, configKey]
  );

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <VStack gap={1} sx={sx} data-testid={dataTestId ?? 'grouped-single-select'}>
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
      <SelectButton
        ref={buttonRef}
        isOpen={isOpen}
        value={selectedOption ? selectedOption.name : defaultDisplayLabel}
        placeholder={selectPlaceholder}
        tags={selectedOption?.tags ?? defaultTags}
        disabled={disabled}
        onClick={handleOpen}
      />
      {isOpen && (
        <ClickAwayListener onClickAway={handleClose}>
          <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-end" sx={{ zIndex: 2000 }}>
            <SelectMenuWrapper>
              <GroupedSingleSelectMenu<T>
                width={selectMenuWidth || anchorEl?.offsetWidth}
                enableSearch={enableSearch}
                searchPlaceholder={
                  searchPlaceholder || LABELS.getDefaultSearchPlaceholder(label || '')
                }
                searchInputValue={inputValue}
                onSearchChange={handleInputChange}
                isLoading={isLoading}
                data={processedData}
                selectedId={value}
                onSelect={handleSelect}
              />
            </SelectMenuWrapper>
          </Popper>
        </ClickAwayListener>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
    </VStack>
  );
}
