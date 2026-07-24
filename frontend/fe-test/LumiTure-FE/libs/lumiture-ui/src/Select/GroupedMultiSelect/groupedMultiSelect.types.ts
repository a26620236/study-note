import type { ReactNode } from 'react';

import type { SxProps, Theme } from '@mui/material';

export interface GroupOption {
  id: string;
  name: string;
  desc?: string;
}

export type GroupData = {
  key: string;
  displayKey?: string;
  values: GroupOption[];
}[];

export type SelectedData = {
  key: string;
  values: string[];
}[];

export interface GroupedMultiSelectProps {
  data: GroupData;
  defaultDisplayValue?: string;
  disabled?: boolean;
  handleClose?: () => void;
  isLoading?: boolean;
  label?: string;
  onChange?: (newValue: SelectedData) => void;
  required?: boolean;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  value: SelectedData;
  wrapperSx?: SxProps<Theme>;
  labelTooltipText?: ReactNode;
  dataTestId?: string;
  defaultExpanded?: boolean;
}

export interface AllSelectStatus {
  isChecked: boolean;
  isIndeterminate: boolean;
}

export interface GroupSelectStatus {
  isChecked: boolean;
  isIndeterminate: boolean;
}
