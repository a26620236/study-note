import { useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { HStack, Icon } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { nFormatter } from '@shared/utils';

import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import { COLOR_KIT } from '@constants';
import type { LumiTagPreviewValueItem } from '@hooks-api';

import { UNTAGGED_COLOR } from '../constants/lumiTagPreview';

const UNTAGGED_DISPLAY_NAME = 'Untagged';

const LABELS = {
  noResourcesMatched: 'No resources matched',
  viewDetails: 'View Details',
} as const;

function formatPortion(portion: number, decimalPlaces = 1) {
  return `${(portion * 100).toFixed(decimalPlaces)}%`;
}

interface UseLumiTagPreviewTableColumnsParams {
  untaggedItem: LumiTagPreviewValueItem | undefined;
  setSelectedValue: (value: LumiTagPreviewValueItem) => void;
}

export function useLumiTagPreviewTableColumns({
  untaggedItem,
  setSelectedValue,
}: UseLumiTagPreviewTableColumnsParams) {
  const hasUntagged = untaggedItem !== undefined && untaggedItem.portion > 0;

  return useMemo<ColumnDef<LumiTagPreviewValueItem>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Tag Value',
        size: 520,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <HStack gap={2} alignItems="center" width="100%" sx={{ minWidth: 0 }}>
            <Box
              width={8}
              height={8}
              flexShrink={0}
              bgcolor={row.index <= 9 ? COLOR_KIT[row.index] : UNTAGGED_COLOR}
            />
            <EllipsisTooltipCell
              text={row.original.name}
              tooltipText={row.original.name}
              flex={1}
              minWidth={0}
            />
          </HStack>
        ),
        footer: () =>
          hasUntagged && (
            <HStack sx={{ gap: 1, alignItems: 'center' }}>
              <Icon name="warning" fill sx={{ color: theme.palette.error.dark, fontSize: 20 }} />
              <Typography variant="buttonBold1" color="error.dark">
                {UNTAGGED_DISPLAY_NAME}
              </Typography>
            </HStack>
          ),
      },
      {
        id: 'spend',
        accessorKey: 'cost',
        header: '30 Days Spend',
        size: 160,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <Typography variant="body1">
            {nFormatter({ num: row.original.cost, fixed: 2, prefix: 'USD ' })}
          </Typography>
        ),
        footer: () =>
          hasUntagged && (
            <Typography variant="bodyBold" color="error.dark">
              {nFormatter({ num: untaggedItem.cost, fixed: 2, prefix: 'USD ' })}
            </Typography>
          ),
      },
      {
        id: 'share',
        accessorKey: 'portion',
        header: 'Share of Spend',
        size: 140,
        meta: { align: 'center' },
        cell: ({ row }) => (
          <Typography variant="body2">{formatPortion(row.original.portion)}</Typography>
        ),
        footer: () =>
          hasUntagged && (
            <Typography variant="bodyBold" color="error.dark">
              {formatPortion(untaggedItem.portion, 2)}
            </Typography>
          ),
      },
      {
        id: 'resources',
        accessorKey: 'resourceCount',
        header: 'Resources',
        size: 180,
        meta: { align: 'center' },
        cell: ({ row }) => {
          const { portion } = row.original;
          if (portion === 0) {
            return (
              <Typography variant="body1" color="text.hint">
                {LABELS.noResourcesMatched}
              </Typography>
            );
          }
          return (
            <Typography
              variant="linkBold"
              onClick={() => setSelectedValue(row.original)}
              color={theme.palette.primary.main}
            >
              {LABELS.viewDetails}
            </Typography>
          );
        },
        footer: hasUntagged
          ? () => (
              <Typography
                variant="linkBold"
                onClick={() => setSelectedValue(untaggedItem)}
                color={theme.palette.error.dark}
              >
                {LABELS.viewDetails}
              </Typography>
            )
          : undefined,
      },
    ],
    [hasUntagged, untaggedItem, setSelectedValue]
  );
}
