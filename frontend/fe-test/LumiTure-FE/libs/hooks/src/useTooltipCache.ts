'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseTooltipCacheOptions {
  itemCount: number;
  renderTooltip: (index: number) => string;
}

interface UseTooltipCacheReturn {
  getTooltipHtml: (index: number) => string;
}

const scheduleNext = (cb: () => void) => {
  const id = setTimeout(cb, 0);
  return () => clearTimeout(id);
};

/**
 * 用於快取 tooltip HTML 並在瀏覽器空閒時預渲染的 hook
 *
 * @example
 * const renderTooltip = useCallback(
 *   (index: number) => renderToString(<MyTooltip data={data[index]} />),
 *   [data]
 * );
 *
 * const { getTooltipHtml } = useTooltipCache({
 *   itemCount: data.length,
 *   renderTooltip,
 * });
 */
export function useTooltipCache({
  itemCount,
  renderTooltip,
}: UseTooltipCacheOptions): UseTooltipCacheReturn {
  const tooltipCacheRef = useRef(new Map<number, string>());

  const getTooltipHtml = useCallback(
    (index: number) => {
      const cached = tooltipCacheRef.current.get(index);
      if (cached) return cached;
      const html = renderTooltip(index);
      tooltipCacheRef.current.set(index, html);
      return html;
    },
    [renderTooltip]
  );

  useEffect(() => {
    tooltipCacheRef.current.clear();
    let index = 0;
    let cancel: (() => void) | undefined = undefined;

    const preRenderBatch = () => {
      const start = Date.now();
      while (index < itemCount && Date.now() - start < 10) {
        if (!tooltipCacheRef.current.has(index)) {
          const html = renderTooltip(index);
          tooltipCacheRef.current.set(index, html);
        }
        index += 1;
      }
      if (index < itemCount) {
        cancel = scheduleNext(preRenderBatch);
      }
    };

    cancel = scheduleNext(preRenderBatch);
    return () => cancel?.();
  }, [itemCount, renderTooltip]);

  return { getTooltipHtml };
}
