import type { RowSelectionState } from '@tanstack/react-table';

import type { RecommendationItem } from '@hooks-api';

/**
 * 從篩選後的資料和 rowSelection 狀態中計算出當前選中的資料
 * @param filteredData 篩選後的資料陣列
 * @param rowSelection React Table 的 rowSelection 狀態 (rec_id -> boolean)
 * @returns 選中的資料陣列
 */
export function getSelectedData(
  filteredData: RecommendationItem[],
  rowSelection: RowSelectionState
): RecommendationItem[] {
  return filteredData.filter((item) => {
    const { recId } = item;
    return rowSelection[recId];
  });
}
