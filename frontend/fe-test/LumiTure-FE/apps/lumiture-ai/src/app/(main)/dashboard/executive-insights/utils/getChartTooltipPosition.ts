import type { TooltipComponentPositionCallback } from 'echarts';

const OFFSET_X = 10;
const OFFSET_Y = 10;

export const getChartTooltipPosition: TooltipComponentPositionCallback = (
  point,
  _params,
  _el,
  _rect,
  size
) => {
  const [x, y] = point;
  const { contentSize } = size;
  const tooltipHeight = contentSize[1];

  return [x + OFFSET_X, y - tooltipHeight - OFFSET_Y];
};
