'use client';

import type React from 'react';

import {
  Box,
  Typography,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from '@mui/material';

import { theme } from '../theme';

import { HStack } from '../Stack';
import { ToggleGroup } from './ToggleGroup';

export interface BadgeToggleButtonProps extends ToggleButtonProps {
  count: number;
  hideBadge?: boolean;
}

interface BadgeToggleGroupProps {
  toggleGroupProps: ToggleButtonGroupProps;
  toggleButtons: BadgeToggleButtonProps[];
  maxDisplayCount?: number;
}

const BadgeWrapper = ({
  children,
  count,
  isSelected,
  maxDisplayCount,
  hideBadge,
  disabled,
}: {
  children: React.ReactNode;
  count: number;
  isSelected: boolean;
  maxDisplayCount: number;
  hideBadge?: boolean;
  disabled?: boolean;
}) => {
  const displayCount = count > maxDisplayCount ? `${maxDisplayCount}+` : count;

  const getTextColor = () => {
    if (disabled) return theme.palette.text.hint;
    if (isSelected) return theme.palette.primary.dark;
    return 'text.secondary';
  };

  const getBadgeColor = () => {
    if (disabled) return theme.palette.text.hint;
    if (isSelected) return theme.palette.primary.main;
    return theme.palette.text.secondary;
  };

  return (
    <HStack gap={2} alignItems="center">
      <Typography variant="buttonRegular1" color={getTextColor()}>
        {children}
      </Typography>
      {!hideBadge && (
        <Box
          borderRadius="5px"
          px={1.5}
          bgcolor={getBadgeColor()}
          display="inline-flex"
          alignItems="center"
        >
          <Typography variant="buttonBold1" color={theme.palette.common.white}>
            {displayCount}
          </Typography>
        </Box>
      )}
    </HStack>
  );
};

export function BadgeToggleGroup({
  toggleGroupProps,
  toggleButtons,
  maxDisplayCount = 999,
}: BadgeToggleGroupProps) {
  const processedToggleButtons = toggleButtons.map(
    ({ count, hideBadge, children, disabled, ...restProps }) => ({
      ...restProps,
      disabled,
      children: (
        <BadgeWrapper
          count={count}
          isSelected={toggleGroupProps.value === restProps.value}
          maxDisplayCount={maxDisplayCount}
          hideBadge={hideBadge}
          disabled={disabled}
        >
          {children}
        </BadgeWrapper>
      ),
    })
  );

  return <ToggleGroup toggleButtons={processedToggleButtons} toggleGroupProps={toggleGroupProps} />;
}
