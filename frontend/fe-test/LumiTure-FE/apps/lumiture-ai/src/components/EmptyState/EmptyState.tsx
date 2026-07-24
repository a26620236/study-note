import * as React from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import Image from 'next/image';

import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { MaterialSymbol } from 'material-symbols';

import { Icon, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import CenteredBox from '@components/CenteredBox';
import { DEFAULT_EMPTY_CONTENT, SIZES } from '@components/EmptyState/constants';

interface EmptyStateProps {
  size?: keyof typeof SIZES;
  type: keyof typeof DEFAULT_EMPTY_CONTENT;
  title?: string;
  desc?: ReactNode | null;
  iconUrl?: string;
  children?: React.ReactNode;
  iconSymbol?: MaterialSymbol;
  sx?: SxProps<Theme>;
}

const EmptyState = ({
  size = 'medium',
  type,
  title,
  desc,
  iconUrl,
  children,
  iconSymbol,
  sx,
}: PropsWithChildren<EmptyStateProps>) => {
  const { iconSize, titleVariant } = SIZES[size];

  return (
    <CenteredBox
      sx={{
        flexGrow: 1,
        color: 'text.secondary',
        minHeight: '400px',
        ...sx,
      }}
    >
      {/* Todo: 暫時兼容 iconSymbol 和 iconUrl 兩種傳入方式。未來會和設計討論將原先的 image 都改用 MaterialSymbol */}
      {iconSymbol ? (
        <Icon
          name={iconSymbol}
          fill
          sx={{ fontSize: iconSize, color: theme.palette.primary.light30 }}
        />
      ) : (
        <Image
          src={iconUrl || DEFAULT_EMPTY_CONTENT[type].iconUrl}
          alt={iconUrl || DEFAULT_EMPTY_CONTENT[type].iconUrl}
          width={iconSize}
          height={iconSize}
        />
      )}
      <VStack justifyContent="center" alignItems="center" gap={2} mt={2}>
        <Typography variant={titleVariant}>{title || DEFAULT_EMPTY_CONTENT[type].title}</Typography>
        {desc !== null && (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              whiteSpace: 'pre-line',
            }}
          >
            {desc || DEFAULT_EMPTY_CONTENT[type].desc}
          </Typography>
        )}
      </VStack>
      {children}
    </CenteredBox>
  );
};

export default EmptyState;
