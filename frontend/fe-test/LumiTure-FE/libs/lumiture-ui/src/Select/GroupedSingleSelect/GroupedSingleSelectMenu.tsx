import type { ChangeEvent } from 'react';

import { BaseSelectMenu } from '../BaseSelectMenu';
import type { Option } from '../SelectOptionItem';
import type { GroupedSingleSelectData } from './groupedSingleSelect.types';
import { GroupedSingleSelectOption } from './GroupedSingleSelectOption';

export interface GroupedSingleSelectMenuProps<T = string | number> {
  width?: number | string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchInputValue?: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  data: GroupedSingleSelectData<T>;
  selectedId: T | null;
  onSelect: (item: Option<T>, groupKey: string) => void;
}

export function GroupedSingleSelectMenu<T = string | number>({
  width = 'auto',
  enableSearch = true,
  searchPlaceholder = '',
  searchInputValue = '',
  onSearchChange,
  isLoading,
  data,
  selectedId,
  onSelect,
}: GroupedSingleSelectMenuProps<T>) {
  return (
    <BaseSelectMenu
      width={width}
      enableSearch={enableSearch}
      searchPlaceholder={searchPlaceholder}
      searchInputValue={searchInputValue}
      onSearchChange={onSearchChange}
    >
      <GroupedSingleSelectOption
        isLoading={isLoading}
        data={data}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </BaseSelectMenu>
  );
}
