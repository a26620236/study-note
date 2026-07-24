import type { CSSProperties } from 'react';

import { SelectOptionItem, type Option } from '../SelectOptionItem';
import { EmptyState, LoadingState } from '../SelectOptionState';
import { VirtualizedListWrapper } from '../VirtualizedListWrapper';

const DISPLAY_ITEMS = 6.5;

interface SingleSelectOptionProps<T = string | number> {
  options: readonly Option<T>[];
  isLoading?: boolean;
  selectedId: T | null;
  handleSelect: (item: Option<T>) => void;
}

export function SingleSelectOption<T = string | number>({
  options,
  isLoading = false,
  selectedId,
  handleSelect,
}: SingleSelectOptionProps<T>) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (options.length === 0) {
    return <EmptyState />;
  }

  // 渲染單個選項的函數
  const renderOption = (option: Option<T>, style?: CSSProperties) => (
    <SelectOptionItem
      key={String(option.id)}
      {...option}
      isSelected={selectedId === option.id}
      onClick={handleSelect}
      style={style}
    />
  );

  return (
    <>
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
