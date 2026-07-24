import { useEffect, type RefObject } from 'react';

interface UseTableInfiniteScrollProps {
  ref: RefObject<HTMLDivElement | null>;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

const DEFAULT_THRESHOLD = 200;

export function useTableInfiniteScroll({
  ref,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = DEFAULT_THRESHOLD,
}: UseTableInfiniteScrollProps) {
  useEffect(() => {
    const tableContainer = ref.current?.querySelector<HTMLElement>('.tableContainer');
    if (!tableContainer) return;

    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = tableContainer;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        fetchNextPage();
      }
    };

    tableContainer.addEventListener('scroll', handleScroll);
    return () => {
      tableContainer.removeEventListener('scroll', handleScroll);
    };
  }, [ref, hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);
}
