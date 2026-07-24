'use client';

import { InputAdornment, TextField, Typography } from '@mui/material';

import { HStack, Icon, MultiSelect } from '@lumiture-ui';

export const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    padding: '0px 8px',
    '& .Mui-disabled': {
      borderColor: 'gray.border',
      color: 'gray.disableDark',
      bgcolor: 'gray.disableLight',
      opacity: 0.6,
    },
  },
  '& .MuiInputBase-input': {
    width: '240px',
    '&::placeholder': {
      color: 'text.hint',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '21px',
    },
  },
};

export function RightsizingTableFilterSkeleton() {
  return (
    <HStack gap={2} justifyContent="space-between" alignItems="center">
      <HStack gap={2} alignItems="center">
        <Typography variant="captionBold" color="primary.main">
          Filter
        </Typography>
        <MultiSelect
          disabled
          configKey="provider"
          value={[]}
          options={[]}
          defaultDisplayLabel="All Cloud Service Providers"
          searchPlaceholder="Search providers"
          wrapperSx={{ width: '240px' }}
        />
        <MultiSelect
          disabled
          configKey="assignTo"
          value={[]}
          options={[]}
          defaultDisplayLabel="All Groups"
          searchPlaceholder="Search groups"
          wrapperSx={{ width: '200px' }}
        />
      </HStack>
      <HStack gap={2}>
        <TextField
          disabled
          placeholder="Search items, resources, or label / tags"
          value=""
          variant="outlined"
          size="medium"
          sx={textFieldStyle}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon name="search" sx={{ color: 'text.hint', fontSize: '20px' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </HStack>
    </HStack>
  );
}
