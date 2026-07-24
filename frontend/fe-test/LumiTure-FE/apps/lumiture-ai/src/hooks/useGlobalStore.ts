import { sendGAEvent } from '@next/third-parties/google';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { getLocalStorageItem, setLocalStorageItem } from '@shared/utils';

import { EVENT_UI } from '@constants';

interface RouteNavigation {
  href: string;
  options?: { scroll: boolean };
}

interface GlobalStore {
  mainSidebar: {
    isMainSidebarOpen: boolean;
    handleMainSidebarToggle: () => void;
  };

  unsavedChange: {
    isDialogOpen: boolean;
    pendingNavigation: RouteNavigation | null; // 攔截器攔截下來的 router.push 參數
    onOpenDialog: ({ href, options }: RouteNavigation) => void;
    onCloseDialog: () => void;
    onConfirmNavigation: () => void; // 按下 UnsavedChangesDialog 的 onConfirm 會觸發這個方法
    setOnConfirmNavigation: (callback: () => void) => void; // 把 onConfirmNavigation 注入原生 nextjs router.push 的方法
  };
}

export const useGlobalStore = create<GlobalStore>()(
  immer((set) => ({
    mainSidebar: {
      isMainSidebarOpen: getLocalStorageItem('isMainSidebarOpen') ?? true,
      handleMainSidebarToggle: () =>
        set((state) => {
          const buttonType = state.mainSidebar.isMainSidebarOpen ? 'close' : 'open';
          sendGAEvent('event', EVENT_UI.SIDEBAR_DISPLAY, { type: buttonType });

          state.mainSidebar.isMainSidebarOpen = !state.mainSidebar.isMainSidebarOpen;
          setLocalStorageItem('isMainSidebarOpen', state.mainSidebar.isMainSidebarOpen);
        }),
    },

    unsavedChange: {
      isDialogOpen: false,
      pendingNavigation: null,
      onOpenDialog: ({ href, options }) =>
        set((state) => {
          state.unsavedChange.isDialogOpen = true;
          state.unsavedChange.pendingNavigation = { href, options };
        }),
      onCloseDialog: () =>
        set((state) => {
          state.unsavedChange.isDialogOpen = false;
          state.unsavedChange.pendingNavigation = null;
        }),
      onConfirmNavigation: () => {
        /* Dynamic method */
      },
      setOnConfirmNavigation: (callback) =>
        set((state) => {
          state.unsavedChange.onConfirmNavigation = callback;
        }),
    },
  }))
);
