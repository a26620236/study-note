import { Suspense, type PropsWithChildren } from 'react';

import { MainSidebarHydration } from '../MainSidebar/MainSidebarHydration';
import { MainSidebarSkeleton } from '../MainSidebar/MainSidebarSkeleton';
import { MainLayoutFrame } from './MainLayoutFrame';

export function MainLayoutFrameProvider({ children }: PropsWithChildren) {
  return (
    <MainLayoutFrame
      sidebar={
        <Suspense fallback={<MainSidebarSkeleton />}>
          <MainSidebarHydration />
        </Suspense>
      }
    >
      {children}
    </MainLayoutFrame>
  );
}
