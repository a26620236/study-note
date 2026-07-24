import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Typography, useTheme } from '@mui/material';
import type { ToastT } from 'sonner';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import { basicColor } from '@lumiture-ui/theme';
import { Spark } from '@lumiture-ui/SvgIcon';

import { DASHBOARD_PATHS, PLATFORM_CONFIG, type PlatformsValue } from '@constants';

import { useAIAnalysisStore } from './useAIAnalysisStore';

const LABELS = {
  getTitle: (platform: PlatformsValue): string => {
    const platformLabel = PLATFORM_CONFIG[platform].label;
    return `AI Analysis - ${platformLabel}`;
  },
  status: 'Status: Completed',
  toastLink: 'View Summary',
};

interface AIAnalysisAttentionDetectedToastProps {
  id: ToastT['id'];
  platform: PlatformsValue;
}

export function AIAnalysisAttentionDetectedToast({
  id,
  platform,
}: AIAnalysisAttentionDetectedToastProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsSummaryDialogOpen, addToastId, removeToastId } = useAIAnalysisStore();
  const targetPath = DASHBOARD_PATHS.costDashboard.pathname.replace('[platform]', platform);

  // 記錄點擊時的 pathname，用來判斷路由是否真的變化
  const clickedFromPathRef = useRef<string | null>(null);

  const toastBackground = `linear-gradient(272deg, ${theme.palette.primary.main} 0%, ${basicColor.secondary.turquoiseBlue[60]} 100%)`;
  const textColor = theme.palette.white.main;

  // 將 addToastId 移到 useEffect 中，避免在渲染期間更新狀態
  useEffect(() => {
    addToastId(platform, id);
  }, [platform, id, addToastId]);

  const handleClickToastLink = () => {
    if (pathname === targetPath) {
      removeToastId(platform, id);
      clickedFromPathRef.current = null;
      setIsSummaryDialogOpen(platform, true);
      return;
    }

    clickedFromPathRef.current = pathname;
    router.push(targetPath);
    setIsSummaryDialogOpen(platform, true);
  };

  // 監聽路由變化
  useEffect(() => {
    if (clickedFromPathRef.current === null) return;

    if (pathname === targetPath) {
      // 成功跳到目標頁面，dismiss toast
      removeToastId(platform, id);
      clickedFromPathRef.current = null;
    } else if (pathname !== clickedFromPathRef.current) {
      // 跳到了其他頁面（不是目標頁面），重置狀態
      clickedFromPathRef.current = null;
    }
    // 如果 pathname === clickedFromPathRef.current，表示還在原來的頁面（可能被攔截取消了）
    // 不做任何事，保持狀態讓 useEffect 可以繼續監聽
  }, [id, pathname, platform, removeToastId, targetPath]);

  return (
    <HStack
      px={4}
      py={2}
      sx={{ background: toastBackground }}
      justifyContent="space-between"
      alignItems="center"
      flexWrap="nowrap"
    >
      <HStack alignItems="center" gap={2} flexWrap="nowrap">
        <Spark sx={{ width: '20px', height: '20px', '& path': { fill: textColor } }} />
        <VStack gap={1}>
          <Typography variant="bodyBold" color={textColor} sx={{ whiteSpace: 'nowrap' }}>
            {LABELS.getTitle(platform)}
          </Typography>
          <Typography variant="body2" color={textColor}>
            {LABELS.status}
          </Typography>
        </VStack>
      </HStack>
      <HStack alignItems="center" gap={2} flexWrap="nowrap">
        <Button
          variant="link"
          sx={{
            color: textColor,
            '&.MuiButton-link': {
              padding: '0 10px',
            },
          }}
          onClick={handleClickToastLink}
        >
          <Typography
            variant="link"
            color={textColor}
            fontSize={14}
            sx={{
              textDecoration: 'underline',
            }}
          >
            {LABELS.toastLink}
          </Typography>
        </Button>
        <Icon
          name="close"
          sx={{
            fontSize: 20,
            color: textColor,
            cursor: 'pointer',
          }}
          onClick={() => removeToastId(platform, id)}
        />
      </HStack>
    </HStack>
  );
}
