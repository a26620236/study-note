import { useMemo, type ForwardedRef } from 'react';

import { setRef } from '@shared/utils';

/**
 * Merges multiple refs into one ref callback.
 * https://github.com/mui/material-ui/blob/next/packages/mui-utils/src/useForkRef/useForkRef.ts#L5
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/src/use-merge-refs.ts
 */

function mergeRefs<T>(...refs: (ForwardedRef<T> | null | undefined)[]): ForwardedRef<T> {
  return (node: T | null) => {
    refs.forEach((ref) => {
      setRef(ref, node);
    });
  };
}

export function useMergeRefs<T>(...refs: (ForwardedRef<T> | null | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => mergeRefs(...refs), refs);
}
