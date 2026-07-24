import { nFormatAbbreviation } from './formatter';

export const getChartYAxisLabel = (value: number, fixed = 2) => {
  if (!value) return '0';
  if (Math.abs(value) < 1000) {
    return value.toFixed(fixed);
  }
  return nFormatAbbreviation({ num: value, fixed });
};
