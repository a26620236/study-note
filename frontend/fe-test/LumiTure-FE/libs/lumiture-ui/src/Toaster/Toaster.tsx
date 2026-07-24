'use client';

import { useTheme } from '@mui/material/styles';
import { Toaster as SonnerToaster } from 'sonner';

import './toast.css';

import { Icon } from '../Icon';

export function Toaster() {
  const theme = useTheme();

  return (
    <SonnerToaster
      position="bottom-left"
      visibleToasts={6}
      toastOptions={{
        unstyled: true,
        style: {
          fontFamily: theme.typography.fontFamily,
          borderRadius: theme.shape.borderRadius,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
        },
        classNames: {
          toast: 'toast-container',
          icon: 'toast-icon',
          title: 'toast-title',
          description: 'toast-description',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning',
          error: 'toast-error',
        },
      }}
      icons={{
        info: <Icon name="info" sx={{ fontSize: 20 }} />,
        success: <Icon name="check_circle" sx={{ fontSize: 20 }} />,
        warning: <Icon name="warning" sx={{ fontSize: 20 }} />,
        error: <Icon name="info" sx={{ fontSize: 20 }} />,
      }}
    />
  );
}
