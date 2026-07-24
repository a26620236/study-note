import type { CSSProperties, ReactNode } from 'react';

import { EmptyState, LoadingState } from '../SelectOptionState';
import { VirtualizedListWrapper } from '../VirtualizedListWrapper';
import type { Option } from './multiSelect.types';
import { MultiSelectOptionItem } from './MultiSelectOptionItem';

const DISPLAY_ITEMS = 6.5;

interface OptionListProps<T = string> {
  slot?: ReactNode;
  options: Option<T>[];
  isLoading?: boolean;
  selectedIds: T[];
  handleToggleSelect: (item: Option<T>) => void;
}

export function MultiSelectOption<T = string>({
  slot,
  options,
  isLoading = false,
  selectedIds,
  handleToggleSelect,
}: OptionListProps<T>) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (options.length === 0) {
    return <EmptyState />;
  }

  // 渲染單個選項的函數
  const renderOption = (option: Option<T>, style?: CSSProperties) => (
    <MultiSelectOptionItem
      key={String(option.id)}
      {...option}
      isSelected={selectedIds.includes(option.id)}
      onClick={handleToggleSelect}
      style={style}
    />
  );

  return (
    <>
      {slot}
      {/* for auto height, if options.length > DISPLAY_ITEMS, use VirtualizedListWrapper */}
      {options.length > DISPLAY_ITEMS ? (
        <VirtualizedListWrapper
          items={options}
          itemHeight={40}
          listHeight={260}
          renderItem={renderOption}
        />
      ) : (
        <>{options.map((option) => renderOption(option))}</>
      )}
    </>
  );
}
