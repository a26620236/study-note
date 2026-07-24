// * Can be used in client side and server side! 讚啦!
import { getServerSession, type Session } from 'next-auth';
import { getSession } from 'next-auth/react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchWrapperOptions<TParams = Record<string, string>> {
  params?: TParams;
  headers?: Record<string, string>;
  requestBody?: unknown;
}
export class ApiError extends Error {
  status: number;
  data?: {
    code: string;
    detail: unknown;
  };

  options?: RequestInit;
  constructor(
    status: number,
    message: string,
    data?: { code: string; detail: unknown },
    options?: RequestInit
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = {
      code: data?.code || 'UNKNOWN_ERROR',
      detail: data?.detail || null,
    };
    this.options = options ?? {};
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function createApiUrl(endpoint: string, params: Record<string, string> = {}): string {
  const isDummyPath = (url: string) => url.includes('http://localhost:3002/');
  const url = isDummyPath(endpoint)
    ? endpoint
    : `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL}${endpoint}`;
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function fetchWrapper<TResponse, TParams = Record<string, string>>(
  endpoint: string,
  method: HttpMethod,
  {
    params,
    headers = {},
    requestBody,
  }: FetchWrapperOptions<TParams> = {} satisfies FetchWrapperOptions<TParams>
): Promise<TResponse> {
  const apiUrl = createApiUrl(endpoint, params ?? {});
  // * Detect server-side or client-side
  const session: Session | null = await (typeof window === 'undefined'
    ? // * Server-side (dynamic import to avoid circular dependency with auth.ts)
      (async () => {
        const { authOptions } = await import('./auth');
        return await getServerSession(authOptions);
      })()
    : // * Client-side
      getSession());

  const options: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
  };

  if (session?.user.access) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    (options.headers as Record<string, string>).Authorization = `Bearer ${session.user.access}`;
  }
  if (requestBody) {
    options.body = JSON.stringify(requestBody);
  }

  try {
    const response = await fetch(apiUrl, options);
    // HTTP 204 No Content
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = response.status === 204 ? {} : await response.json();

    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(`Error message came from backend: ${json.message || 'No message'}`);
      throw new ApiError(
        response.status,
        `An error occurred. Please try again later, or contact your admin for help.`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        json.data || null,
        options
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unsafe-member-access
    return (json.data || json) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error or unexpected error occurred');
  }
}

export const api = {
  get: async <TResponse, TParams = Record<string, string>>(
    endpoint: string,
    options?: FetchWrapperOptions<TParams>
  ) => await fetchWrapper<TResponse, TParams>(endpoint, 'GET', options ?? {}),

  post: async <TResponse>(
    endpoint: string,
    options?: FetchWrapperOptions<never> & { requestBody?: unknown }
  ) => await fetchWrapper<TResponse, never>(endpoint, 'POST', options),

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  put: async <TResponse, TBody = unknown>(
    endpoint: string,
    options?: FetchWrapperOptions<never> & { requestBody?: TBody }
  ) => await fetchWrapper<TResponse, never>(endpoint, 'PUT', options),

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  patch: async <TResponse, TBody = unknown>(
    endpoint: string,
    options?: FetchWrapperOptions<never> & { requestBody?: TBody }
  ) => await fetchWrapper<TResponse, never>(endpoint, 'PATCH', options),

  delete: async <TResponse, TParams = Record<string, string>>(
    endpoint: string,
    options?: FetchWrapperOptions<TParams>
  ) => await fetchWrapper<TResponse, TParams>(endpoint, 'DELETE', options ?? {}),
};
