import { useEffect, useRef } from 'react';

interface UsePollingProps<T> {
  data?: T[];
  poll: boolean;
  setPoll: (poll: boolean) => void;
  maxAttempts?: number;
}

/**
 * 群組創建後的 polling hook
 * 用於檢測群組數量變化，確保後端資料更新完成
 */
export const usePolling = <T>({ data, poll, setPoll, maxAttempts = 10 }: UsePollingProps<T>) => {
  const dataLengthRef = useRef<number>(0);
  const maxPollingAttemptsRef = useRef<number>(maxAttempts);

  // 重置 polling 狀態
  const resetPolling = () => {
    maxPollingAttemptsRef.current = maxAttempts;
    setPoll(false);
  };

  // 開始 polling
  const startPolling = () => {
    dataLengthRef.current = data?.length || 0;
    maxPollingAttemptsRef.current = maxAttempts;
    setPoll(true);
  };

  // polling 邏輯
  useEffect(() => {
    /*
     * 創建群組後的 polling 邏輯
     * 問題：後端創建群組後，立即查詢可能無法獲取到最新資料
     * 解決：透過 polling 持續檢查，直到資料更新完成(最多10次)
     */
    if (!poll || !data || maxPollingAttemptsRef.current <= 0) return;

    const currentLength = data.length;
    const previousLength = dataLengthRef.current;

    // 如果群組數量沒有變化，繼續等待
    if (currentLength === previousLength) {
      maxPollingAttemptsRef.current -= 1;
      return;
    }

    // 群組數量已更新，停止 polling 並更新參考值
    setPoll(false);
    dataLengthRef.current = currentLength;
  }, [poll, data, setPoll]);

  return {
    poll,
    startPolling,
    resetPolling,
  };
};
