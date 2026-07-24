import { toast, type ToastT } from 'sonner';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { PlatformsValue } from '@constants';
import { AIAnalysisStatus, type AIAnalysis } from '@hooks-ws';

interface PlatformState {
  status: AIAnalysisStatus;
  prevStatus: AIAnalysisStatus;
  data: AIAnalysis | null;
  isSummaryDialogOpen: boolean;
  toastIds: ToastT['id'][];
}

interface AIAnalysisStore {
  //  儲存WebSocket各平台的分析狀態
  gcp: PlatformState;
  aws: PlatformState;
  azure: PlatformState;
  //  設定WebSocket各平台的分析狀態
  setStatus: (platform: PlatformsValue, status: AIAnalysisStatus) => void;
  setPrevStatus: (platform: PlatformsValue, prevStatus: AIAnalysisStatus) => void;
  //  設定WebSocket各平台的分析資料
  setData: (platform: PlatformsValue, data: AIAnalysis) => void;
  //  重置WebSocket各平台的分析狀態
  reset: (platform: PlatformsValue) => void;
  resetAll: () => void;
  //  設定Cost Summary各平台的對話框是否開啟
  setIsSummaryDialogOpen: (platform: PlatformsValue, isSummaryDialogOpen: boolean) => void;
  // Toast ID 管理
  addToastId: (platform: PlatformsValue, toastId: ToastT['id']) => void;
  removeToastId: (platform: PlatformsValue, toastId: ToastT['id']) => void;
  clearToastIds: (platform: PlatformsValue) => void;
}

const initialPlatformState: PlatformState = {
  status: AIAnalysisStatus.Ready,
  prevStatus: AIAnalysisStatus.Ready,
  data: null,
  isSummaryDialogOpen: false,
  toastIds: [],
};

export const useAIAnalysisStore = create<AIAnalysisStore>()(
  immer((set) => ({
    gcp: { ...initialPlatformState },
    aws: { ...initialPlatformState },
    azure: { ...initialPlatformState },

    setData: (platform, data) =>
      set((state) => {
        state[platform].data = data;
      }),

    setStatus: (platform, status) =>
      set((state) => {
        if (status === AIAnalysisStatus.Ready) {
          state[platform].prevStatus = AIAnalysisStatus.Ready;
        }
        state[platform].status = status;
      }),

    setPrevStatus: (platform, prevStatus) =>
      set((state) => {
        state[platform].prevStatus = prevStatus;
      }),

    setIsSummaryDialogOpen: (platform, isSummaryDialogOpen) =>
      set((state) => {
        state[platform].isSummaryDialogOpen = isSummaryDialogOpen;
      }),

    addToastId: (platform, toastId) =>
      set((state) => {
        if (state[platform].toastIds.includes(toastId)) return;
        state[platform].toastIds.push(toastId);
      }),

    removeToastId: (platform, toastId) =>
      set((state) => {
        toast.dismiss(toastId);
        state[platform].toastIds = state[platform].toastIds.filter((id) => id !== toastId);
      }),

    clearToastIds: (platform) =>
      set((state) => {
        state[platform].toastIds.forEach((id) => toast.dismiss(id));
        state[platform].toastIds = [];
      }),

    reset: (platform) =>
      set((state) => {
        state[platform] = { ...initialPlatformState };
      }),

    resetAll: () =>
      set((state) => {
        state.gcp = { ...initialPlatformState };
        state.aws = { ...initialPlatformState };
        state.azure = { ...initialPlatformState };
      }),
  }))
);
