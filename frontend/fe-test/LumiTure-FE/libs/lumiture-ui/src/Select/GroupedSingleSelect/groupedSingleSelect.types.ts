import type { ReactNode, Ref } from 'react';

import type { SxProps } from '@mui/material';

import type { Option } from '../SelectOptionItem';

export type GroupedSingleSelectOption<T = string | number> = Option<T>;

export interface GroupedSingleSelectGroup<T = string | number> {
  key: string;
  displayKey?: string;
  values: GroupedSingleSelectOption<T>[];
}

export type GroupedSingleSelectData<T = string | number> = GroupedSingleSelectGroup<T>[];

export interface GroupedSingleSelectChangeEvent<T = string | number> {
  key: string;
  group: string;
  value: T | null;
}

export interface GroupedSingleSelectProps<T = string | number> {
  configKey: string;
  label?: string;
  value: T | null;
  data: GroupedSingleSelectData<T>;
  onChange: (event: GroupedSingleSelectChangeEvent<T>) => void;
  enableSearch?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  required?: boolean;
  defaultDisplayLabel?: string;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  selectMenuWidth?: number;
  labelTooltipText?: ReactNode;
  description?: ReactNode;
  defaultTags?: ReactNode[];
  sx?: SxProps;
  dataTestId?: string;
  ref?: Ref<HTMLElement>;
}
