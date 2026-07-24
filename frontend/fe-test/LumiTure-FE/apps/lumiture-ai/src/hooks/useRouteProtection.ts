import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useGlobalStore } from './useGlobalStore';

interface RoutePush {
  href: string;
  options?: { scroll: boolean };
}

export const useRouteProtection = ({
  isBlock,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCloseCallback = () => {},
}: {
  isBlock: boolean;
  onCloseCallback?: () => void;
}) => {
  const { onOpenDialog, onCloseDialog, setOnConfirmNavigation, pendingNavigation } = useGlobalStore(
    (state) => state.unsavedChange
  );
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalPushRef = useRef<typeof router.push>(router.push);

  const handleRouterPush = useCallback((args: RoutePush) => {
    const { href, options } = args;
    if (href) {
      originalPushRef.current(href, options);
    }
  }, []);

  useEffect(() => {
    router.push = (href: RoutePush['href'], options: RoutePush['options']) => {
      if (isBlock) {
        onOpenDialog({ href, options });
        return;
      }

      handleRouterPush({ href, options });
    };

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      router.push = originalPushRef.current;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlock]);

  useEffect(() => {
    // 把 nextjs router.push 注入 onConfirmNavigation 的地方
    setOnConfirmNavigation(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      handleRouterPush(pendingNavigation as RoutePush);
      onCloseDialog();
      onCloseCallback();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingNavigation, onCloseDialog]);
};
