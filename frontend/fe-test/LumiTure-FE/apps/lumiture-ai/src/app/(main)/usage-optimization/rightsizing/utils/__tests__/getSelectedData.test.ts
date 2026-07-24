import type { RowSelectionState } from '@tanstack/react-table';

import type { RecommendationItem } from '@hooks-api';

import { getSelectedData } from '../getSelectedData';

function createItem(recId: string): RecommendationItem {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return { recId } as unknown as RecommendationItem;
}

describe('getSelectedData', () => {
  it('should return empty array when filteredData is empty', () => {
    const rowSelection: RowSelectionState = { 'rec-1': true };

    expect(getSelectedData([], rowSelection)).toEqual([]);
  });

  it('should return empty array when rowSelection is empty', () => {
    const items = [createItem('rec-1'), createItem('rec-2')];

    expect(getSelectedData(items, {})).toEqual([]);
  });

  it('should return only items whose recId is true in rowSelection', () => {
    const item1 = createItem('rec-1');
    const item2 = createItem('rec-2');
    const item3 = createItem('rec-3');
    const rowSelection: RowSelectionState = { 'rec-1': true, 'rec-3': true };

    const result = getSelectedData([item1, item2, item3], rowSelection);

    expect(result).toEqual([item1, item3]);
  });

  it('should not include items whose recId is false in rowSelection', () => {
    const item = createItem('rec-1');
    const rowSelection: RowSelectionState = { 'rec-1': false };

    expect(getSelectedData([item], rowSelection)).toEqual([]);
  });

  it('should return all items when all are selected', () => {
    const item1 = createItem('rec-1');
    const item2 = createItem('rec-2');
    const rowSelection: RowSelectionState = { 'rec-1': true, 'rec-2': true };

    expect(getSelectedData([item1, item2], rowSelection)).toEqual([item1, item2]);
  });
});
