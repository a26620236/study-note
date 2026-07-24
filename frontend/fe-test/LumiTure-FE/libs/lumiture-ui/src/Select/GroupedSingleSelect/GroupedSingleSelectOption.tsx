import { useMemo, type CSSProperties } from 'react';

import { FixedSizeList } from 'react-window';

import { SelectOptionItem, type Option } from '../SelectOptionItem';
import { EmptyState, LoadingState } from '../SelectOptionState';
import { UNGROUPED_KEY } from './constants';
import type { GroupedSingleSelectData } from './groupedSingleSelect.types';
import { GroupedSingleSelectGroupHeader } from './GroupedSingleSelectGroupHeader';

const DISPLAY_ITEMS = 6.5;
const VIRTUAL_LIST_HEIGHT = 260;
const ITEM_HEIGHT = 40;

type FlattenedItem<T = string | number> =
  | { type: 'header'; groupKey: string; displayKey?: string; isFirstHeader: boolean }
  | { type: 'option'; groupKey: string; option: Option<T> };

export interface GroupedSingleSelectOptionProps<T = string | number> {
  isLoading: boolean;
  data: GroupedSingleSelectData<T>;
  selectedId: T | null;
  onSelect: (item: Option<T>, groupKey: string) => void;
}

export function GroupedSingleSelectOption<T = string | number>({
  isLoading,
  data,
  selectedId,
  onSelect,
}: GroupedSingleSelectOptionProps<T>) {
  const flattenedItems = useMemo(() => {
    const items: FlattenedItem<T>[] = [];

    data.forEach((group) => {
      if (group.values.length === 0) return;

      // group header
      if (group.key !== UNGROUPED_KEY) {
        items.push({
          type: 'header',
          groupKey: group.key,
          displayKey: group.displayKey,
          isFirstHeader: items.length === 0,
        });
      }

      // group options
      group.values.forEach((option) => {
        items.push({ type: 'option', groupKey: group.key, option });
      });
    });

    return items;
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (flattenedItems.length === 0) return <EmptyState />;

  const renderItem = (item: FlattenedItem<T>, style?: CSSProperties) => {
    if (item.type === 'header') {
      return (
        <GroupedSingleSelectGroupHeader
          key={`header-${item.groupKey}`}
          groupKey={item.groupKey}
          displayKey={item.displayKey}
          isFirstHeader={item.isFirstHeader}
          sx={style}
        />
      );
    }
    return (
      <SelectOptionItem
        key={`${item.groupKey}-${String(item.option.id)}`}
        {...item.option}
        isSelected={selectedId === item.option.id}
        onClick={(option) => onSelect(option, item.groupKey)}
        style={style}
      />
    );
  };

  if (flattenedItems.length > DISPLAY_ITEMS) {
    return (
      <FixedSizeList
        itemCount={flattenedItems.length}
        itemSize={ITEM_HEIGHT}
        height={VIRTUAL_LIST_HEIGHT}
        width="100%"
      >
        {({ index, style }) => renderItem(flattenedItems[index], style)}
      </FixedSizeList>
    );
  }

  return <>{flattenedItems.map((item) => renderItem(item))}</>;
}
