import { formatRelativeTime } from '@shared/utils';

import type { UsersInfos } from '@hooks-api';

/**
 * 格式化用戶數據，將原始用戶數據轉換為表格顯示格式
 * @param users 原始用戶數據數組
 * @returns 格式化後的用戶數據數組
 */
export function formatGroupMembers(users: UsersInfos[] | undefined): UsersInfos[] {
  if (!users) return [];

  return users.map((user) => ({
    ...user,
    userName: user.userName === ' ' ? '--' : user.userName,
    activeStatus: user.activeStatus ? 'Active' : 'Inactive',
    lastLogin: formatRelativeTime(user.lastLogin || ''),
  }));
}
