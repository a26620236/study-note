import type { ChangeEvent } from 'react';

import { BaseSelectMenu } from '../BaseSelectMenu';
import type { Option } from '../SelectOptionItem';
import { SingleSelectOption } from './SingleSelectOption';

export interface SingleSelectMenuProps<T = string | number> {
  width?: number | string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchInputValue?: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  options: readonly Option<T>[];
  selectedId: T | null;
  onSelect: (item: Option<T>) => void;
}

export function SingleSelectMenu<T = string | number>({
  width = 'auto',
  enableSearch = true,
  searchPlaceholder = '',
  searchInputValue = '',
  onSearchChange,
  isLoading,
  options,
  selectedId,
  onSelect,
}: SingleSelectMenuProps<T>) {
  return (
    <BaseSelectMenu
      width={width}
      enableSearch={enableSearch}
      searchPlaceholder={searchPlaceholder}
      searchInputValue={searchInputValue}
      onSearchChange={onSearchChange}
    >
      <SingleSelectOption
        isLoading={isLoading}
        options={options}
        selectedId={selectedId}
        handleSelect={onSelect}
      />
    </BaseSelectMenu>
  );
}
