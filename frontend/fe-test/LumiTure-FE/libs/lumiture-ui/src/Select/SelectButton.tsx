import { forwardRef, type ReactNode } from 'react';

import { alpha, Box, InputBase, styled, Typography, type InputBaseProps } from '@mui/material';

import { Icon } from '../Icon';
import { VStack } from '../Stack';

export interface SelectInputButtonProps extends InputBaseProps {
  isOpen: boolean;
  tags?: ReactNode[];
  disabled?: boolean;
  helperText?: ReactNode;
}

const EndAreaWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const SelectButton = forwardRef<HTMLElement, SelectInputButtonProps>(
  function SelectInputButton({ isOpen, tags = [], disabled = false, helperText, ...props }, ref) {
    return (
      <VStack sx={{ position: 'relative' }}>
        <InputBase
          ref={ref}
          disabled={disabled}
          error={!!helperText}
          endAdornment={
            <EndAreaWrapper>
              {tags.map((tag, order) => (
                <Box key={order}>{tag}</Box>
              ))}
              <Icon
                name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                sx={(theme) => ({ color: alpha(theme.palette.common.black, 0.54) })}
              />
            </EndAreaWrapper>
          }
          sx={{
            caretColor: 'transparent',
            input: {
              '&:hover': { cursor: disabled ? 'not-allowed' : 'pointer' },
              color: disabled ? 'text.hint' : 'text.primary',
              width: '100%',
              // flex 容器內需 minWidth: 0 才能收縮，搭配 textOverflow 讓過長的選取值顯示 ...
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            bgcolor: disabled ? 'gray.disableLight' : 'common.white',
          }}
          {...props}
        />
        {helperText && (
          <Typography
            variant="caption"
            color="error.main"
            sx={{ position: 'absolute', top: '100%', left: 0, mt: 0.5, mx: 0 }}
          >
            {helperText}
          </Typography>
        )}
      </VStack>
    );
  }
);
