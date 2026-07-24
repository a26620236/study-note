import { isAxiosError } from 'axios';

import type { ErrorResponseGenerics } from '@shared/types';

export function getAxiosError<Code = string, Detail = unknown>(
  error: unknown
): ErrorResponseGenerics<Code, Detail>['data'] | undefined {
  if (!isAxiosError<ErrorResponseGenerics<Code, Detail>>(error)) {
    return undefined;
  }
  return error.response?.data.data;
}
