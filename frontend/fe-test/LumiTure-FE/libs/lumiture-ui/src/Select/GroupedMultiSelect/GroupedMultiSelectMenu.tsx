import { BaseSelectMenu } from '../BaseSelectMenu';
import type { AllSelectStatus, GroupData, SelectedData } from './groupedMultiSelect.types';
import { GroupedMultiSelectOption } from './GroupedMultiSelectOption';

export interface GroupedMultiSelectMenuProps {
  groupKeyLabel?: string;
  width?: number | string;
  searchPlaceholder: string;
  searchInputValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  data: GroupData;
  selectedData: SelectedData;
  allSelectStatus: AllSelectStatus;
  onToggleSelect: (groupKey: string, optionId: string) => void;
  onToggleGroupSelect: (groupKey: string) => void;
  onToggleSelectAll: () => void;
  defaultExpanded: boolean;
}

export function GroupedMultiSelectMenu({
  width = 'auto',
  searchPlaceholder,
  searchInputValue,
  onSearchChange,
  isLoading,
  data,
  selectedData,
  allSelectStatus,
  onToggleSelect,
  onToggleGroupSelect,
  onToggleSelectAll,
  defaultExpanded,
}: GroupedMultiSelectMenuProps) {
  const hasSearch = searchInputValue.trim().length > 0;

  return (
    <BaseSelectMenu
      width={width}
      enableSearch={true}
      searchPlaceholder={searchPlaceholder}
      searchInputValue={searchInputValue}
      onSearchChange={onSearchChange}
    >
      <GroupedMultiSelectOption
        isLoading={isLoading}
        data={data}
        selectedData={selectedData}
        allSelectStatus={allSelectStatus}
        onToggleSelect={onToggleSelect}
        onToggleGroupSelect={onToggleGroupSelect}
        onToggleSelectAll={onToggleSelectAll}
        defaultExpanded={defaultExpanded}
        hasSearch={hasSearch}
      />
    </BaseSelectMenu>
  );
}
