import { memo, useCallback, useMemo, useState } from 'react';

import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { FixedSizeList } from 'react-window';

import { SelectAllOption } from '../SelectAllOption';
import { UNGROUPED_KEY } from './constants';
import type {
  AllSelectStatus,
  GroupData,
  GroupOption,
  SelectedData,
} from './groupedMultiSelect.types';
import { GroupedMultiSelectOptionItem } from './GroupedMultiSelectOptionItem';
import { GroupHeader } from './GroupHeader';

const DISPLAY_ITEMS = 6.5;
const VIRTUAL_LIST_HEIGHT = 260;
const ITEM_HEIGHT = 40;

const getSelectedValuesByGroupKey = (selectedData: SelectedData, groupKey: string): string[] =>
  selectedData.find((item) => item.key === groupKey)?.values ?? [];

const getGroupSelectStatus = (
  groupKey: string,
  groupValues: GroupOption[],
  selectedData: SelectedData
) => {
  const selectedValues = getSelectedValuesByGroupKey(selectedData, groupKey);
  const groupValueIds = groupValues.map((v) => v.id);
  const selectedInGroup = groupValueIds.filter((id) => selectedValues.includes(id));

  const allSelected = groupValueIds.length > 0 && selectedInGroup.length === groupValueIds.length;
  const someSelected = selectedInGroup.length > 0 && !allSelected;

  return { isChecked: allSelected, isIndeterminate: someSelected };
};

export interface GroupedMultiSelectOptionProps {
  groupKeyLabel?: string;
  isLoading: boolean;
  data: GroupData;
  selectedData: SelectedData;
  allSelectStatus: AllSelectStatus;
  onToggleSelect: (groupKey: string, optionId: string) => void;
  onToggleGroupSelect: (groupKey: string) => void;
  onToggleSelectAll: () => void;
  defaultExpanded: boolean;
  hasSearch: boolean;
}

type FlattenedItem =
  | {
      type: 'group';
      groupKey: string;
    }
  | {
      type: 'option';
      groupKey: string;
      option: GroupOption;
    };

export const GroupedMultiSelectOption = memo(function OptionList({
  isLoading,
  data,
  selectedData,
  allSelectStatus,
  onToggleSelect,
  onToggleGroupSelect,
  onToggleSelectAll,
  defaultExpanded,
  hasSearch,
}: GroupedMultiSelectOptionProps) {
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(() =>
    defaultExpanded
      ? new Set()
      : new Set(data.filter((group) => group.key !== UNGROUPED_KEY).map((group) => group.key))
  );

  // 搜尋進行中強制全展開，但保留 collapsedKeys，搜尋清空後恢復先前的收合狀態。
  const showCollapseControl = !hasSearch;

  const handleToggleCollapse = useCallback((groupKey: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }, []);

  const flattenedItems = useMemo(() => {
    const items: FlattenedItem[] = [];

    data.forEach((group) => {
      if (group.key !== UNGROUPED_KEY) {
        items.push({ type: 'group', groupKey: group.key });
      }
      if (showCollapseControl && collapsedKeys.has(group.key)) {
        return;
      }
      // eslint-disable-next-line max-nested-callbacks
      group.values.forEach((value) => {
        items.push({
          type: 'option',
          groupKey: group.key,
          option: value,
        });
      });
    });

    return items;
  }, [data, showCollapseControl, collapsedKeys]);

  const renderVirtualItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = flattenedItems[index];

      if (item.type === 'group') {
        const group = data.find((g) => g.key === item.groupKey);
        const groupSelectStatus = getGroupSelectStatus(
          item.groupKey,
          group?.values ?? [],
          selectedData
        );

        return (
          <div style={style}>
            <GroupHeader
              displayKey={group?.displayKey}
              count={group?.values.length}
              groupKey={item.groupKey}
              groupSelectStatus={groupSelectStatus}
              onToggleGroupSelect={onToggleGroupSelect}
              isCollapsed={showCollapseControl ? collapsedKeys.has(item.groupKey) : undefined}
              onToggleCollapse={showCollapseControl ? handleToggleCollapse : undefined}
            />
          </div>
        );
      } else {
        const selectedValues = getSelectedValuesByGroupKey(selectedData, item.groupKey);
        const isSelected = selectedValues.includes(item.option.id);

        return (
          <div style={style}>
            <GroupedMultiSelectOptionItem
              groupKey={item.groupKey}
              option={item.option}
              isSelected={isSelected}
              onToggleSelect={onToggleSelect}
            />
          </div>
        );
      }
    },
    [
      data,
      flattenedItems,
      onToggleGroupSelect,
      onToggleSelect,
      selectedData,
      showCollapseControl,
      collapsedKeys,
      handleToggleCollapse,
    ]
  );

  if (isLoading) {
    return (
      <Stack sx={{ py: 4 }}>
        <CircularProgress size={40} sx={{ m: 'auto' }} />
      </Stack>
    );
  }

  if (data.length === 0) {
    return (
      <Typography color="text.hint" sx={{ m: 2.5 }}>
        No options
      </Typography>
    );
  }

  return (
    <>
      <SelectAllOption onClick={onToggleSelectAll} {...allSelectStatus} />
      <Divider />

      {/*
       * data.length 只是群組資料的陣列長度，並不包含選項的數量
       * 故這邊使用 flattenedItems.length 判斷虛擬化：包含群組標題+所有選項的實際渲染項目數
       */}
      {flattenedItems.length > DISPLAY_ITEMS ? (
        <FixedSizeList
          itemCount={flattenedItems.length}
          itemSize={ITEM_HEIGHT}
          height={VIRTUAL_LIST_HEIGHT}
          width="100%"
        >
          {renderVirtualItem}
        </FixedSizeList>
      ) : (
        <>
          {data.map((group) => {
            const groupSelectStatus = getGroupSelectStatus(group.key, group.values, selectedData);
            const isCollapsed = showCollapseControl && collapsedKeys.has(group.key);

            return (
              <Box key={group.key}>
                {/* 未分組選項不顯示群組標題 */}
                {group.key !== UNGROUPED_KEY && (
                  <GroupHeader
                    displayKey={group.displayKey}
                    count={group.values.length}
                    groupKey={group.key}
                    groupSelectStatus={groupSelectStatus}
                    onToggleGroupSelect={onToggleGroupSelect}
                    isCollapsed={showCollapseControl ? isCollapsed : undefined}
                    onToggleCollapse={showCollapseControl ? handleToggleCollapse : undefined}
                  />
                )}

                {/* 群組內的選項 */}
                {!isCollapsed &&
                  group.values.map((option) => {
                    const selectedValues = getSelectedValuesByGroupKey(selectedData, group.key);
                    const isSelected = selectedValues.includes(option.id);

                    return (
                      <GroupedMultiSelectOptionItem
                        key={`${group.key}-${option.id}`}
                        groupKey={group.key}
                        option={option}
                        isSelected={isSelected}
                        onToggleSelect={onToggleSelect}
                      />
                    );
                  })}
              </Box>
            );
          })}
        </>
      )}
    </>
  );
});
