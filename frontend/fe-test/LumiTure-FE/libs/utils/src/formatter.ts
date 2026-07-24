import { findLast, isFinite } from 'lodash-es';

export const nFormatter = ({
  num,
  fixed = 0,
  prefix = '',
  suffix = '',
}: {
  num: number | string | null | undefined;
  fixed?: number;
  prefix?: string;
  suffix?: string;
}): string => {
  if (num === null || num === undefined) return '--';

  const parsedNum = Number(num);
  if (isNaN(parsedNum) || !isFinite(parsedNum)) {
    return typeof num === 'string' ? num : '--';
  }

  const prefixString = parsedNum >= 0 ? prefix : `-${prefix}`;
  const absoluteValue = Math.abs(parsedNum);

  return `${prefixString}${absoluteValue.toLocaleString(undefined, {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  })}${suffix}`;
};

/**
 * @DESCRIPTION
 * 產品需求：100,000 以上才格式化成 K
 * @NOTE
 * 1e3 = 1,000、1e5 = 100,000...以此類推
 */
const DEFAULT_EXPONENTIATION_MAP = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'K' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'Qa' },
  { value: 1e18, symbol: 'Qi' },
];
export const nFormatAbbreviation = ({
  num,
  fixed = 2,
  prefix = '',
  suffix = '',
}: {
  num?: number | string | null;
  fixed?: number;
  prefix?: string;
  suffix?: string;
}): string => {
  if (!isFinite(num)) return typeof num === 'string' ? num : '--';
  const numericValue = Number(num);
  const absoluteValue = Math.abs(numericValue);

  const unitEntry = findLast(DEFAULT_EXPONENTIATION_MAP, ({ value }) => absoluteValue >= value);

  if (!unitEntry || absoluteValue < 1000) {
    return nFormatter({ num: numericValue, fixed, prefix, suffix });
  }

  const sign = numericValue < 0 ? '-' : '';
  const abbreviatedValue = absoluteValue / unitEntry.value;
  const displayFixed = abbreviatedValue % 1 === 0 ? 0 : fixed;

  return `${sign}${prefix}${nFormatter({ num: abbreviatedValue, fixed: displayFixed })}${unitEntry.symbol}${suffix}`;
};
