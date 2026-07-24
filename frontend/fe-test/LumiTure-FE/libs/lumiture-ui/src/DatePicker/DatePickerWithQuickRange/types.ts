import type { SyntheticEvent } from 'react';

import type { SxProps } from '@mui/material/styles';
import type { DatePickerProps } from 'react-datepicker';

export type DateItem = Date | null;

// NOTE: react-datepicker 的 startDate, endDate 型別問題，先 hardcode 處理，等修正被發布後再調整
// ref: https://github.com/Hacker0x01/react-datepicker/issues/5259

export type DateItemHardCode = DateItem | undefined;

export interface RangeItem {
  label: string;
  value: string;
}

export type DatePickerWithQuickRangeProps = DatePickerProps & {
  dataTestId?: string;
  onChange?: (date: [DateItem, DateItem], type?: string | SyntheticEvent) => void;
  quickRangeList?: RangeItem[];
  selectedQuickRange?: string;
  onQuickRangeSelect?: (label: string) => void;
  disabled?: boolean;
  sx?: SxProps;
  datePickerSx?: SxProps;
  onCalendarClose?: () => void;
};

export interface QuickRangeListProps {
  list: RangeItem[];
  selectedQuickRange?: string;
  onQuickRangeSelect?: (label: string) => void;
  children: React.ReactNode;
}

export type QuickRangeItemProps = RangeItem & {
  selectedQuickRange?: string;
  onQuickRangeSelect?: (label: string) => void;
};
