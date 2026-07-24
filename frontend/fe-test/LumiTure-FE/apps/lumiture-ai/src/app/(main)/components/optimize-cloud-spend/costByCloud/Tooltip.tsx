import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { palette } from '@lumiture-ui/theme';

import type { cloudBarStyleSchema } from '@app/(main)/components/optimize-cloud-spend/costByCloud/CostByCloudChart';
import type { CostByCloudTooltipParam } from '@app/(main)/components/optimize-cloud-spend/types';
import TooltipItem from '@app/(main)/components/TooltipItem';
import type { PlatformsValue } from '@constants';
import type { CostByCloudItem } from '@hooks-api';

type CloudBarStyleSchema = typeof cloudBarStyleSchema;

const TOOLTIP_STYLES = {
  WRAPPER: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 240,
    maxWidth: 580,
    padding: 8,
    gap: 8,
    borderRadius: 5,
  },
  TITLE: {
    fontWeight: 400,
    color: palette.text.primary,
  },
  DIVIDER: {
    height: 1,
    backgroundColor: palette.gray.selected,
  },
} as const;

const Tooltip = ({
  params,
  cloudBarStyleSchema,
}: {
  params: CostByCloudTooltipParam[];
  cloudBarStyleSchema: CloudBarStyleSchema;
}) => {
  const cloudName = String(params[0].axisValueLabel ?? '');

  return (
    <Box style={TOOLTIP_STYLES.WRAPPER}>
      <Box
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
          {cloudName.toUpperCase()}
        </Typography>
      </Box>
      <Box style={TOOLTIP_STYLES.DIVIDER} />
      {params.map((param) => {
        const { value } = param;
        const { label, itemStyle } =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-unnecessary-condition -- legacy code
          cloudBarStyleSchema[cloudName as PlatformsValue]?.[
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            param.seriesName as keyof CostByCloudItem
          ] ?? {};

        return (
          <Box key={param.seriesId} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {param.seriesName === 'overrun' && typeof value === 'number' && (
              <TooltipItem
                label={value > 0 ? 'Budget Overrun' : 'Remaining Budget'}
                value={Math.abs(value)}
                color={value > 0 ? palette.error.dark : 'unset'}
                valueStyles={{ color: value > 0 ? palette.error.dark : 'unset' }}
              />
            )}
            {param.seriesName !== 'overrun' &&
              (typeof value === 'string' || typeof value === 'number') && (
                <TooltipItem
                  label={label}
                  value={value}
                  color={itemStyle.color}
                  markPointStyles={{
                    ...itemStyle,
                    borderStyle: 'borderType' in itemStyle ? itemStyle.borderType : 'unset',
                  }}
                />
              )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Tooltip;
