import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

import { InputAdornment, TextField, Typography } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { HStack, Icon, MultiSelect } from '@lumiture-ui';

import { useRightsizingStore } from '@app/(main)/usage-optimization/rightsizing/hooks/useRightsizingStore';
import { useGetRecommendOptions } from '@hooks-api';

import { textFieldStyle } from './RightsizingTableFilterSkeleton';

const LABELS = {
  filter: 'Filter',
  searchPlaceholder: 'Search items, resources, or label / tags',
  provider: {
    defaultLabel: 'All Cloud Service Providers',
    searchPlaceholder: 'Search providers',
  },
  assignTo: {
    defaultLabel: 'All Groups',
    searchPlaceholder: 'Search groups',
  },
};

interface FilterChangeParams {
  value: string[];
}

export function RightsizingTableFilter() {
  // 從 store 取得狀態和方法
  const {
    selectedAssignToGroups,
    setSelectedAssignToGroups,
    selectedProviders,
    setSelectedProviders,
    setSearchText,
  } = useRightsizingStore();
  const [inputText, setInputText] = useState(''); // 用於顯示的即時值

  // 定義兩個 select 的草稿狀態
  const [draftProviders, setDraftProviders] = useState<string[]>(selectedProviders);
  const [draftAssignToGroups, setDraftAssignToGroups] = useState<string[]>(selectedAssignToGroups);

  const { data: recommendOptions } = useGetRecommendOptions();

  const { cloudService = [], groups = [] } = recommendOptions?.data ?? {};

  const debouncedSetSearchText = useDebounceCallback(setSearchText, 500);

  const assignToOptions = useMemo(
    () =>
      groups.map((group) => ({
        id: group,
        name: group,
        desc: group,
      })),
    [groups]
  );

  const providerOptions = useMemo(
    () =>
      cloudService.map((provider) => ({
        id: provider,
        name: provider,
        desc: provider,
      })),
    [cloudService]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInputText(newValue); // 立即更新顯示
      debouncedSetSearchText(newValue); // debounced 更新到 store
    },
    [debouncedSetSearchText]
  );

  const handleAssignToFilterChange = useCallback(({ value }: FilterChangeParams) => {
    setDraftAssignToGroups(value);
  }, []);

  const handleProviderFilterChange = useCallback(({ value }: FilterChangeParams) => {
    setDraftProviders(value);
  }, []);

  const handleAssignToClose = useCallback(() => {
    // 只有在關閉時才更新 store
    setSelectedAssignToGroups(draftAssignToGroups);
  }, [draftAssignToGroups, setSelectedAssignToGroups]);

  const handleProviderClose = useCallback(() => {
    // 只有在關閉時才更新 store
    setSelectedProviders(draftProviders);
  }, [draftProviders, setSelectedProviders]);

  return (
    <HStack gap={2} justifyContent="space-between" alignItems="center">
      <HStack gap={2} alignItems="center">
        <Typography variant="captionBold" color="primary.main">
          {LABELS.filter}
        </Typography>
        <MultiSelect
          configKey="provider"
          value={draftProviders}
          options={providerOptions}
          onChange={handleProviderFilterChange}
          defaultDisplayLabel={LABELS.provider.defaultLabel}
          searchPlaceholder={LABELS.provider.searchPlaceholder}
          showSelectAllOption
          wrapperSx={{ width: '240px' }}
          handleClose={handleProviderClose}
        />
        <MultiSelect
          configKey="assignTo"
          value={draftAssignToGroups}
          options={assignToOptions}
          onChange={handleAssignToFilterChange}
          defaultDisplayLabel={LABELS.assignTo.defaultLabel}
          searchPlaceholder={LABELS.assignTo.searchPlaceholder}
          showSelectAllOption
          wrapperSx={{ width: '200px' }}
          handleClose={handleAssignToClose}
        />
      </HStack>
      <HStack gap={2}>
        <TextField
          placeholder={LABELS.searchPlaceholder}
          value={inputText}
          onChange={(e) => handleInputChange(e)}
          variant="outlined"
          size="medium"
          sx={textFieldStyle}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon name="search" sx={{ color: 'text.hint', fontSize: '20px' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </HStack>
    </HStack>
  );
}
