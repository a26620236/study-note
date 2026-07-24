import { useEffect, useRef, type RefObject } from 'react';

import type { EChartsType } from 'echarts/core';

/**
 * ReactECharts 實例的型別定義
 * 因為 echarts-for-react 的 EChartsInstance 是 any，所以我們定義一個介面來描述實際需要的功能
 */
interface ReactEChartsInstance {
  getEchartsInstance: () => EChartsType;
}

/**
 * @NOTE
 * 切換頁面時碰上推擠 main page container 寬度時，圖表寬度有機率渲染不正確
 * Workaround 作法：
 * 當 .main-page-container 容器尺寸變化就呼叫 ECharts 的 resize 方法
 * 確保圖表在容器變化時能正確渲染
 */
export const useChartResizeObserver = (chartRef: RefObject<ReactEChartsInstance | null>) => {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const container = document.querySelector('.main-page-container');
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    });

    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    return () => {
      resizeObserver.disconnect();
    };
  }, [chartRef]);
};
