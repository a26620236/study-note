import { useEffect, useState, type RefObject } from 'react';

export const useOverflow = (ref: RefObject<HTMLElement | null>, maxLines = 1) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [lineHeight, setLineHeight] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) return;

    const checkOverflow = () => {
      if (ref.current) {
        if (maxLines === 1) {
          // Single line overflow check
          setIsOverflowed(ref.current.scrollWidth > ref.current.clientWidth);
        } else {
          // Multi-line overflow check
          const element = ref.current;
          const computedLineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
          setLineHeight(computedLineHeight);
          const maxHeight = computedLineHeight * maxLines;
          const actualHeight = element.scrollHeight;

          setIsOverflowed(actualHeight > maxHeight);
        }
      }
    };

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(ref.current);

    // Check overflow on mount
    checkOverflow();

    return () => observer.disconnect();
  }, [ref, maxLines]);

  return { isOverflowed, lineHeight };
};
