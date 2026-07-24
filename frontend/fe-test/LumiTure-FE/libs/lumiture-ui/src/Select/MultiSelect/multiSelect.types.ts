import type { ReactNode, Ref } from 'react';

import type { SxProps } from '@mui/material';

export interface MultiSelectChangeEvent<T = string> {
  key: string;
  value: T[];
}

export interface Option<T = string> {
  id: T;
  name: string;
  desc?: string;
}

export interface MultiSelectProps<T = string> {
  configKey: string;
  label?: string;
  value: T[];
  options: Option<T>[];
  isLoading?: boolean;
  onChange?: (params: MultiSelectChangeEvent<T>) => void;
  defaultDisplayLabel?: string;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  showSelectAllOption?: boolean;
  wrapperSx?: SxProps;
  disabled?: boolean;
  handleClose?: () => void;
  helperText?: ReactNode;
  required?: boolean;
  labelTooltipText?: ReactNode;
  // 開啟後：hover 顯示已選項目清單（最多 5 筆 + 「...+N more」提示）。預設 false。
  showSelectedValuesTooltip?: boolean;
  dataTestId?: string;
  ref?: Ref<HTMLElement>;
}
