import { getServerSession } from 'next-auth';

import { authOptions } from './auth';

/**
 * 取得帶有 Authorization Bearer token 的 headers (僅能在 Server 使用)
 */
export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const session = await getServerSession(authOptions);

  return {
    Authorization: `Bearer ${session?.user.access}`,
  };
}
