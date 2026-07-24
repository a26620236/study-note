'use client';

import { useState } from 'react';

import { InputAdornment, Typography } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { Icon, Input, VStack } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import type { PlatformsValue } from '@constants';
import type { PreviewDetailType } from '@hooks-api';

import { TOGGLE_LABEL_MAP } from '../../constants/lumiTagPreviewResourceDialog';

const LABELS = {
  renderItemsSummary: (itemCount: number, totalCost: number) =>
    `${itemCount} items · 30-Day Total: ${nFormatter({ num: totalCost, fixed: 2, prefix: 'USD ' })}`,
};

interface LumiTagResourceDialogSearchProps {
  selectedPlatform: PlatformsValue;
  selectedToggleType: PreviewDetailType;
  itemCount?: number;
  totalCost?: number;
  disabled?: boolean;
  setSearchText: (searchText: string) => void;
}

export function LumiTagResourceDialogSearch({
  selectedPlatform,
  selectedToggleType,
  itemCount,
  totalCost,
  disabled = false,
  setSearchText: setSearchTextProps,
}: LumiTagResourceDialogSearchProps) {
  const [searchText, setSearchText] = useState('');

  const setSearchTextDebounced = useDebounceCallback(setSearchTextProps, 500);

  function handleChange(value: string) {
    setSearchText(value);
    setSearchTextDebounced(value);
  }

  const placeholder = `Search ${TOGGLE_LABEL_MAP[selectedPlatform][selectedToggleType]}`;

  return (
    <VStack gap={2} alignItems="flex-end">
      <Input
        value={searchText}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        size="small"
        disabled={disabled}
        sx={{ width: 228 }}
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
      {itemCount !== undefined && totalCost !== undefined && (
        <Typography variant="caption" color="text.secondary">
          {LABELS.renderItemsSummary(itemCount, totalCost)}
        </Typography>
      )}
    </VStack>
  );
}
