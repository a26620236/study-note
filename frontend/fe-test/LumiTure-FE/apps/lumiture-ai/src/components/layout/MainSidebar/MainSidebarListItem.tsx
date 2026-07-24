'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSession } from 'next-auth/react';

import { HStack, Icon } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { Beta } from '@lumiture-ui/SvgIcon';

import { Depth, MAIN_PATHS } from '@constants';
import type { SidebarItem } from '@hooks-api';

interface MainSidebarListItemProps {
  item: SidebarItem;
}

const resolveDynamicPath = (pathname: string, params: Record<string, string>) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  Object.keys(params).reduce((path, key) => path?.replace(`[${key}]`, params[key]), pathname);

// * 遞迴 Component
export default function MainSidebarListItem({ item }: MainSidebarListItemProps) {
  const { data: session } = useSession();

  const tierOneGroup = session?.user.groups.find((group) => group.depth === Depth.T1);
  const tierOneGroupId = String(tierOneGroup?.groupId);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const routeItem = MAIN_PATHS[item.key];

  const getItemIcon = () => {
    if (!routeItem.icon) return null;

    if (typeof routeItem.icon === 'string') {
      return <Icon name={routeItem.icon} />;
    }
    return routeItem.icon;
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const itemPathname = resolveDynamicPath(routeItem?.pathname, {
    tierOneGroupId,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ...(routeItem?.defaultParams ?? {}),
  });

  const selectedStyle = (() => {
    const style = { bgcolor: 'primary.main', borderRadius: '5px' };

    if (!itemPathname) return {};
    if (pathname === itemPathname) return style;

    // nested route
    if (itemPathname !== MAIN_PATHS.overview.pathname && pathname.includes(itemPathname)) {
      return style;
    }

    return {};
  })();

  const handleClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    }

    if (routeItem.pathname) {
      router.push(itemPathname);
    }
  };

  const checkCurrentPathMatchItem = useCallback(
    (item: SidebarItem): boolean => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (pathname === routeItem?.pathname) return true;

      if (item.children) {
        /* eslint-disable react-hooks/immutability -- legacy code: recursive useCallback references itself before declaration */
        return item.children.some(
          (child) =>
            pathname.startsWith(
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              resolveDynamicPath(MAIN_PATHS[child.key]?.pathname, {
                tierOneGroupId,
              })
            ) || Boolean(child.children && checkCurrentPathMatchItem(child))
        );
        /* eslint-enable react-hooks/immutability */
      }

      return false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    [pathname, routeItem?.pathname, tierOneGroupId]
  );

  useEffect(() => {
    if (checkCurrentPathMatchItem(item)) {
      setIsOpen(true);
    }
  }, [pathname, item, checkCurrentPathMatchItem]);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!routeItem) return null;
  return (
    <>
      <ListItem
        sx={{
          p: 2,
          color: 'common.white',
          '&:hover': { bgcolor: alpha(theme.palette.white.main, 0.15) },
          '&:active': { bgcolor: alpha(theme.palette.white.main, 0.05) },
          ...selectedStyle,
        }}
        onClick={handleClick}
      >
        <ListItemButton sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}>
          <HStack alignItems="center" justifyContent="space-between" width="100%">
            <HStack
              gap={2}
              alignItems="center"
              justifyContent="center"
              sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}
            >
              {getItemIcon() && (
                <ListItemIcon sx={{ color: theme.palette.white.main, p: 0 }}>
                  {getItemIcon()}
                </ListItemIcon>
              )}
              <ListItemText
                primary={routeItem.name}
                sx={{ margin: 0 }}
                slotProps={{
                  primary: {
                    noWrap: true,
                  },
                }}
              />
            </HStack>
            <HStack gap={1} alignItems="center" sx={{ flexShrink: 0 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {routeItem?.isBeta && <Beta />}
              {item.children && (isOpen ? <ExpandLess /> : <ExpandMore />)}
            </HStack>
          </HStack>
        </ListItemButton>
      </ListItem>

      {item.children && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {item.children.map((child) => (
              <Box key={child.uuid} sx={{ pl: 4 }}>
                <MainSidebarListItem item={child} />
              </Box>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
