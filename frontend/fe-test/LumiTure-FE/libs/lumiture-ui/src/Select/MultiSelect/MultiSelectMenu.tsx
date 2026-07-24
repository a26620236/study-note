import Divider from '@mui/material/Divider';

import { BaseSelectMenu } from '../BaseSelectMenu';
import { SelectAllOption } from '../SelectAllOption';
import type { Option } from './multiSelect.types';
import { MultiSelectOption } from './MultiSelectOption';

export interface MultiSelectMenuProps<T = string> {
  width?: number | string;
  searchPlaceholder?: string;
  searchInputValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  options: Option<T>[];
  selectedIds: T[];
  onToggleSelect: (item: Option<T>) => void;
  onToggleSelectAll: () => void;
  selectAllOptionStatus: {
    isChecked: boolean;
    isIndeterminate: boolean;
  };
  showSelectAllOption?: boolean;
}

export function MultiSelectMenu<T = string>({
  width = 'auto',
  searchPlaceholder,
  searchInputValue,
  onSearchChange,
  isLoading,
  options,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  selectAllOptionStatus,
  showSelectAllOption = true,
}: MultiSelectMenuProps<T>) {
  return (
    <BaseSelectMenu
      width={width}
      enableSearch={true}
      searchPlaceholder={searchPlaceholder}
      searchInputValue={searchInputValue}
      onSearchChange={onSearchChange}
    >
      <MultiSelectOption<T>
        slot={
          showSelectAllOption && (
            <>
              <SelectAllOption onClick={onToggleSelectAll} {...selectAllOptionStatus} />
              <Divider />
            </>
          )
        }
        isLoading={isLoading}
        options={options}
        selectedIds={selectedIds}
        handleToggleSelect={onToggleSelect}
      />
    </BaseSelectMenu>
  );
}
