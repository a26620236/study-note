import type { RawAxiosRequestHeaders } from 'axios';
import { useSession } from 'next-auth/react';

interface AuthHeadersResult {
  hasToken: boolean;
  headers: RawAxiosRequestHeaders;
}

export function useAuthHeaders(): AuthHeadersResult {
  const { data } = useSession();
  const token = data?.user.access;

  return {
    hasToken: !!token,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}
