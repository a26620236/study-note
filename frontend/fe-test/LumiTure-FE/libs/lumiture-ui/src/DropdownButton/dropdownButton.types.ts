import type { MouseEvent, ReactNode } from 'react';

import type { PopperProps, SxProps } from '@mui/material';

export interface DropdownButtonItem<T = unknown> {
  /** 純字串會自動包進 span;傳入 ReactNode 則直接渲染（需自訂排版時用） */
  label: ReactNode;
  value: T;
  icon?: ReactNode;
  onClick?: (value: T) => void;
  disabled?: boolean;
  selected?: boolean;
  tooltipText?: string;
  dataTestId?: string;
  /** 顯示在 label 右側的 tag,內容由外面自訂;空陣列則不顯示 */
  tags?: ReactNode[];
}

// `list` 與 `children` 二擇一
type DropdownContent<T> =
  | { list: DropdownButtonItem<T>[]; children?: never }
  | {
      list?: never;
      children: ReactNode | ((handleMenuClose: () => void) => ReactNode);
    };

// 三個全給 = 受控;全不給 = 由元件自己管
type OpenCloseProps =
  | {
      isOpen: boolean;
      handleClose: () => void;
      handleOpen: (event: MouseEvent<HTMLElement>) => void;
    }
  | { isOpen?: never; handleClose?: never; handleOpen?: never };

/**
 * DropdownButton 的 props。
 *
 * - `list` 與 `children` 二擇一:用 `list` 渲染內建選單,或用 `children` 放自訂內容。
 * - `isOpen` / `handleOpen` / `handleClose`:三個全給 = 自行控制開關;全不給 = 由元件自己管。
 * - `onClose`:Popper 關閉後觸發。
 */
export type DropdownButtonProps<T = unknown> = {
  anchorEl?: HTMLElement | null;
  button?: ReactNode;
  placement?: PopperProps['placement'];
  onClose?: () => void;
  popperProps?: Omit<PopperProps, 'open' | 'anchorEl'>;
  disabled?: boolean;
  sx?: SxProps;
} & OpenCloseProps &
  DropdownContent<T>;
