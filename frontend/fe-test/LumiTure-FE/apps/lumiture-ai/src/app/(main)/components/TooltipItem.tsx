import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { palette } from '@lumiture-ui/theme';
import { nFormatter } from '@shared/utils';

import type { CurrencySymbol } from '@constants';

interface TooltipItemProps {
  label: string;
  value: number | string;
  currencySymbol?: CurrencySymbol;
  color?: string | null;
  markType?: 'square' | 'line' | 'dash' | 'circle';
  markPointStyles?: React.CSSProperties;
  valueStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
}

const TooltipItem = ({
  label,
  labelStyles,
  color,
  markType = 'square',
  markPointStyles,
  value,
  valueStyles,
  currencySymbol,
}: TooltipItemProps) => {
  const getMarkPointStyles = () => {
    const baseStyles = {
      backgroundColor: color ?? 'unset',
      ...markPointStyles,
    };

    if (markType === 'line') {
      return {
        ...baseStyles,
        width: 24,
        height: 2,
        borderRadius: 1,
      };
    }

    if (markType === 'dash') {
      return {
        backgroundColor: 'transparent',
        width: 24,
        height: 0,
        borderBottom: `2px dashed ${color ?? 'unset'}`,
        ...markPointStyles,
      };
    }

    if (markType === 'circle') {
      return {
        ...baseStyles,
        width: 8,
        height: 8,
        borderRadius: '50%',
        marginRight: 2,
      };
    }
    return {
      ...baseStyles,
      width: 8,
      height: 8,
    };
  };

  const TOOLTIP_ITEM_STYLES = {
    ROOT: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      width: '100%',
    },
    MARK_POINT: getMarkPointStyles(),
    LABEL: {
      flex: 1,
      minWidth: 0,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: palette.text.primary,
      fontWeight: 400,
      ...labelStyles,
    },
    VALUE: {
      flexShrink: 0,
      color: palette.text.primary,
      fontWeight: 700,
      marginLeft: 'auto',
      ...valueStyles,
    },
  };

  return (
    <Box style={TOOLTIP_ITEM_STYLES.ROOT}>
      {!!color && <Box style={TOOLTIP_ITEM_STYLES.MARK_POINT} />}
      <Typography variant="caption" style={TOOLTIP_ITEM_STYLES.LABEL}>
        {label}
      </Typography>
      <Typography variant="captionBold" style={TOOLTIP_ITEM_STYLES.VALUE}>
        {nFormatter({ num: value, fixed: 2, prefix: currencySymbol })}
      </Typography>
    </Box>
  );
};

export default TooltipItem;
