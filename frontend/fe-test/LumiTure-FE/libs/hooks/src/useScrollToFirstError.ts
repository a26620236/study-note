import { useCallback } from 'react';

// RHF 把 array root error（如 z.array().min(1) 的訊息）放在合成的 `root` key 下，
// 它不是真實欄位路徑，所以 path 不接 `root`，讓回傳值對齊 DOM 上掛的 id。
function buildErrorPath(currentPath: string, key: string): string {
  if (key === 'root') return currentPath;
  if (!currentPath) return key;
  return `${currentPath}.${key}`;
}

/**
 * 遞迴找到第一個有錯誤訊息的路徑
 * @param errors - 錯誤對象
 * @param currentPath - 當前路徑
 * @returns 第一個有錯誤的完整路徑，如 "fieldName.month.subField"
 */
export function findFirstErrorPath(errors: unknown, currentPath = ''): string | null {
  if (!errors || typeof errors !== 'object') return null;

  if ('message' in errors && errors.message) {
    return currentPath;
  }

  for (const [key, value] of Object.entries(errors)) {
    if (!value || typeof value !== 'object') continue;
    const newPath = buildErrorPath(currentPath, key);
    const foundPath = findFirstErrorPath(value, newPath);
    if (foundPath) return foundPath;
  }

  return null;
}

export function useScrollToFirstError() {
  const focusDelay = 300;

  return useCallback((errors: Record<string, unknown>) => {
    if (typeof errors !== 'object' || Object.keys(errors).length === 0) {
      return;
    }

    for (const fieldName of Object.keys(errors)) {
      const fieldErrors = errors[fieldName];
      if (!fieldErrors) continue;

      const errorPath = findFirstErrorPath(fieldErrors, fieldName);
      if (!errorPath) continue;

      const targetElement = document.getElementById(errorPath);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        setTimeout(() => {
          targetElement.focus();
        }, focusDelay);

        return;
      }
    }
  }, []);
}
