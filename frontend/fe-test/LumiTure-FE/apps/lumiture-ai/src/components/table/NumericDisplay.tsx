import { Tooltip, Typography, type TypographyProps } from '@mui/material';

import { nFormatAbbreviation, nFormatter } from '@shared/utils';

interface NumericDisplayProps {
  value: number;
  /** 顯示變體：amount(一般數字)、currency(貨幣)、percentage(百分比) */
  variant?: 'amount' | 'currency' | 'percentage';
  /** 貨幣代碼，當 variant='currency' 時使用 */
  currency?: string;
  /** 自訂前綴字串（會覆蓋 variant 預設值） */
  prefix?: string;
  /** 自訂後綴字串（會覆蓋 variant 預設值） */
  suffix?: string;
  /** 是否根據正負值顯示顏色，預設 true */
  showColor?: boolean;
  /** 自訂 Typography 屬性（color 會被內部邏輯覆蓋） */
  typographyProps?: Omit<TypographyProps, 'children'>;
}

/**
 * 數字顯示元件 - 支援一般數字、貨幣、百分比等格式
 * @example
 * // 一般數字
 * <NumericDisplay value={1234.56} />
 *
 * // 貨幣
 * <NumericDisplay value={1234.56} variant="currency" currency="USD" />
 *
 * // 百分比
 * <NumericDisplay value={12.34} variant="percentage" />
 *
 * // 自訂前後綴
 * <NumericDisplay value={1234} prefix="$" suffix=" USD" />
 */
export function NumericDisplay({
  value,
  variant = 'amount',
  currency,
  prefix: customPrefix,
  suffix: customSuffix,
  showColor = true,
  typographyProps,
}: NumericDisplayProps) {
  // 決定 prefix 和 suffix：優先使用自訂值，否則根據 variant 使用預設值
  const getPrefix = () => {
    if (customPrefix !== undefined) return customPrefix;
    if (variant === 'currency' && currency) return ` ${currency} `;
    return undefined;
  };

  const getSuffix = () => {
    if (customSuffix !== undefined) return customSuffix;
    if (variant === 'percentage') return '%';
    return undefined;
  };

  const getColor = () => {
    if (!showColor) return 'text.primary';
    return value >= 0 ? 'text.primary' : 'error.main';
  };

  const prefix = getPrefix();
  const suffix = getSuffix();
  const color = getColor();

  return (
    <Tooltip title={nFormatter({ num: value, fixed: 2, prefix, suffix })}>
      <Typography
        variant="body1"
        {...typographyProps}
        sx={{ fontWeight: 500, color, ...typographyProps?.sx }}
      >
        {nFormatAbbreviation({ num: value, prefix, suffix })}
      </Typography>
    </Tooltip>
  );
}
