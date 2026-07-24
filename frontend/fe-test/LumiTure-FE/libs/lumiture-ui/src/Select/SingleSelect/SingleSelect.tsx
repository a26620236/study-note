import { useCallback, useState, type ChangeEvent, type ReactNode, type Ref } from 'react';

import { ClickAwayListener, Popper, Typography, type SxProps } from '@mui/material';

import { useMergeRefs } from '@shared/hooks';

import { InputLabel } from '../../Input/InputLabel';
import { VStack } from '../../Stack';
import { SelectButton } from '../SelectButton';
import { SelectMenuWrapper } from '../SelectMenuWrapper';
import type { Option } from '../SelectOptionItem';
import { SingleSelectMenu } from './SingleSelectMenu';

const LABELS = {
  getDefaultSearchPlaceholder: (label: string) => `Search ${label.toLowerCase()}`,
};

export interface SingleSelectChangeEvent<T = string | number> {
  key: string;
  value: T | null;
}

export interface SingleSelectProps<T = string | number> {
  configKey: string;
  label?: string;
  value: T | null;
  options: readonly Option<T>[];
  onChange: (event: SingleSelectChangeEvent<T>) => void;
  enableSearch?: boolean;
  defaultDisplayLabel?: string;
  isLoading?: boolean;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  selectMenuWidth?: number;
  defaultTags?: ReactNode[];
  sx?: SxProps;
  required?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  labelTooltipText?: ReactNode;
  dataTestId?: string;
  ref?: Ref<HTMLElement>;
}

export function SingleSelect<T = string | number>({
  configKey,
  label = '',
  value,
  options,
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
}: SingleSelectProps<T>) {
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

  const filteredOptions = enableSearch
    ? options.filter((option) => {
        const checkItems = [option.desc || '', option.name || ''];
        return checkItems.some((_text) => _text.toLowerCase().includes(inputValue.toLowerCase()));
      })
    : options;

  const selectedOption = options.find((option) => option.id === value);

  const handleSelect = useCallback(
    (item: Option<T>) => {
      onChange({
        key: configKey,
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
    <VStack gap={1} sx={sx} data-testid={dataTestId ?? 'single-select'}>
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
              <SingleSelectMenu<T>
                width={selectMenuWidth || anchorEl?.offsetWidth}
                enableSearch={enableSearch}
                searchPlaceholder={
                  searchPlaceholder || LABELS.getDefaultSearchPlaceholder(label || '')
                }
                searchInputValue={inputValue}
                onSearchChange={handleInputChange}
                isLoading={isLoading}
                options={filteredOptions}
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
