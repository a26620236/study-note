import { useEffect, useState, type ChangeEvent } from 'react';

import { InputAdornment } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { Icon, Input } from '@lumiture-ui';

import { PlatformsValue } from '@constants';

import { usePlatformResources } from '../hooks/usePlatformResources';

const LABELS = {
  searchPlaceholder: 'Search resources',
};

interface ResourcesSearchProps {
  platform: PlatformsValue;
}

export function ResourcesSearch({ platform }: ResourcesSearchProps) {
  const [inputText, setInputText] = useState('');

  const searchText = usePlatformResources((state) => {
    switch (platform) {
      case PlatformsValue.GCP:
        return state.gcp.searchText;
      case PlatformsValue.AWS:
        return state.aws.searchText;
      case PlatformsValue.AZURE:
        return state.azure.searchText;
    }
  });

  const setSearchText = usePlatformResources((state) => state.setSearchText);

  const debouncedSetSearchText = useDebounceCallback(setSearchText, 500);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputText(newValue);
    debouncedSetSearchText(platform, newValue);
  };

  useEffect(() => {
    setInputText(searchText);
  }, [searchText]);

  return (
    <Input
      placeholder={LABELS.searchPlaceholder}
      value={inputText}
      onChange={handleSearchChange}
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
  );
}
