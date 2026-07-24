import type { ReactElement } from 'react';

import { FixedSizeList } from 'react-window';

export interface VirtualizedListWrapperProps<T> {
  items: readonly T[];
  itemHeight: number;
  listHeight: number;
  renderItem: (item: T, style?: React.CSSProperties) => ReactElement;
}

export function VirtualizedListWrapper<T>({
  items,
  itemHeight,
  listHeight,
  renderItem,
}: VirtualizedListWrapperProps<T>) {
  return (
    <FixedSizeList
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={items}
      height={listHeight}
      width="100%"
    >
      {({ index, style }) => renderItem(items[index], style)}
    </FixedSizeList>
  );
}
