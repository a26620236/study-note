import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { Icon } from '@lumiture-ui';

export type NoteBoxType = 'info' | 'success' | 'warning' | 'failed';

interface NoteBoxProps {
  variant: NoteBoxType;
  content: React.ReactNode;
}

export const NOTEBOX_TYPES: Record<
  NoteBoxType,
  { value: NoteBoxType; color: string; icon: ReactNode }
> = {
  info: {
    value: 'info',
    color: 'primary.main',
    icon: <Icon name="info" sx={{ color: 'primary.main', fontSize: 20 }} />,
  },
  success: {
    value: 'success',
    color: 'success.main',
    icon: <Icon name="check_circle" sx={{ color: 'success.main', fontSize: 20 }} />,
  },
  warning: {
    value: 'warning',
    color: 'warning.main',
    icon: <Icon name="warning" sx={{ color: 'warning.main', fontSize: 20 }} />,
  },
  failed: {
    value: 'failed',
    color: 'error.main',
    icon: <Icon name="error" sx={{ color: 'error.main', fontSize: 20 }} />,
  },
};

const NoteBox = ({ variant, content }: NoteBoxProps) => (
  <Box
    width="100%"
    sx={{
      padding: 0,
      borderRadius: '4px',
      backgroundColor: 'common.white',
      position: 'relative',
      display: 'flex',
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
    }}
  >
    <Box
      sx={{
        minWidth: '16px',
        border: 'none',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'absolute',
        left: '-1px',
        top: '-1px',
        bottom: '-1px',
      }}
    >
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          bgcolor: NOTEBOX_TYPES[variant].color,
          height: '100%',
          width: '4px',
        }}
      />
    </Box>
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 16px' }}>
      {NOTEBOX_TYPES[variant].icon}
      {content}
      <Box sx={{ width: '86px', height: '10px', justifyContent: 'flex-end' }} />
    </Box>
  </Box>
);

export default NoteBox;
