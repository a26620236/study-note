import { useEffect, useRef, useState, type PropsWithChildren, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import Collapse, { type CollapseProps } from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { HStack, Icon, VStack } from '@lumiture-ui';

interface LegendItemProps {
  id: string;
  label: string;
  color: string;
  tooltipText?: ReactNode;
}

interface CollapsibleLegendsProps {
  legends: LegendItemProps[];
  defaultExpanded?: boolean;
}

interface CollapseWrapProps extends PropsWithChildren<CollapseProps> {
  disabled: boolean;
}

const MAX_LEGENDS_HEIGHT = 40;

function CollapseWrap({ children, disabled, ...others }: CollapseWrapProps): ReactNode {
  return disabled ? children : <Collapse {...others}>{children}</Collapse>;
}

function LegendItem({ label, color, tooltipText }: LegendItemProps) {
  return (
    <Tooltip title={tooltipText} placement="left">
      <HStack alignItems="center" sx={{ gap: 1 }}>
        <Box sx={{ width: 8, height: 8, bgcolor: color }} />
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </HStack>
    </Tooltip>
  );
}

export function CollapsibleLegends({ legends, defaultExpanded = false }: CollapsibleLegendsProps) {
  const legendRootRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapHeight, setWrapHeight] = useState<number>(0);
  const showArrow = wrapHeight > MAX_LEGENDS_HEIGHT;

  const [collapseOpen, setCollapseOpen] = useState<boolean>(defaultExpanded);

  const handleToggleCollapse = () => {
    setCollapseOpen((prev) => !prev);
  };

  const handleSetWrapHeight = () => {
    if (!wrapRef.current) return;
    const wrapHeight = wrapRef.current.getBoundingClientRect().height;
    setWrapHeight(wrapHeight);
  };

  useEffect(() => {
    if (!legendRootRef.current) return;

    const resizeObserver = new ResizeObserver(handleSetWrapHeight);
    resizeObserver.observe(legendRootRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [legends.length]);

  return (
    <VStack ref={legendRootRef} alignItems="center">
      <CollapseWrap disabled={!showArrow} in={collapseOpen} collapsedSize={MAX_LEGENDS_HEIGHT}>
        <HStack
          ref={wrapRef}
          justifyContent="center"
          sx={{
            position: 'relative',
            flexWrap: 'wrap',
            rowGap: 1,
            columnGap: 2,
            '&:before': (theme) => ({
              display: showArrow ? 'block' : 'none',
              opacity: collapseOpen ? 0 : 1,
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(255, 255, 255, 0.04),rgba(255, 255, 255, 0.6))',
              transition: theme.transitions.create('opacity'),
              pointerEvents: 'none',
            }),
          }}
        >
          {legends.map(({ id, label, color, tooltipText }) => (
            <LegendItem key={id} id={id} label={label} color={color} tooltipText={tooltipText} />
          ))}
        </HStack>
      </CollapseWrap>

      {showArrow && (
        <Tooltip title="Toggle Legends" placement="right">
          <IconButton size="medium" sx={{ color: 'text.secondary' }} onClick={handleToggleCollapse}>
            <Icon
              name="keyboard_arrow_down"
              sx={(theme) => ({
                transform: `rotate(${collapseOpen ? 180 : 0}deg)`,
                transition: theme.transitions.create('transform'),
              })}
            />
          </IconButton>
        </Tooltip>
      )}
    </VStack>
  );
}
