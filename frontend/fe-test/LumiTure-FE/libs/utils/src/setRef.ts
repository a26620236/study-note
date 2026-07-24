import type { RefObject } from 'react';

/**
 * 安全地設置 ref 的值，同時支援 ref object 和 ref callback 兩種類型。
 *
 * React 的 ref 有兩種形式：
 * - **Ref Object**（由 `useRef` 創建）：直接設置 `.current` 屬性
 * - **Ref Callback**（函式形式）：呼叫該函式並傳入值
 *
 * 此函式統一處理這兩種類型，常用於 `useMergeRefs` 中合併多個 refs。
 *
 * @param ref - 要設置的 ref（可以是 object、callback、null 或 undefined）
 * @param value - 要指派的值（通常是 DOM 元素或 null）
 */
export function setRef<T>(
  ref: RefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null
): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    // eslint-disable-next-line no-param-reassign
    ref.current = value;
  }
}
