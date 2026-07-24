import type { ReactNode } from 'react';

import { Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { HStack, MultiSelect, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import type { PlatformsValue } from '@constants';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';

interface PlatformResourceProps {
  platform: PlatformsValue;
  icon: ReactNode;
  title: string;
  label: string;
  searchPlaceholder: string;
  selectPlaceholder: string;
  options: { id: string; name: string; desc: string }[];
  fieldName:
    | 'rightsizingScope.aws.resources'
    | 'rightsizingScope.gcp.resources'
    | 'rightsizingScope.azure.resources';
  configKey: string;
  resourceIdToGroupIdMap: Record<string, string>;
}

export function PlatformResource({
  platform,
  icon: IconComponent,
  title,
  label,
  searchPlaceholder,
  selectPlaceholder,
  options,
  fieldName,
  configKey,
  resourceIdToGroupIdMap,
}: PlatformResourceProps) {
  const { control, trigger, setValue } = useFormContext<RightsizingSettingsFormData>();

  const handleResourceChange = (value: string[], fieldOnChange: (value: string[]) => void) => {
    fieldOnChange(value);
    // 根據選中的 resource id 找到對應的 groupId
    const groupIds = value.map((resourceId) => resourceIdToGroupIdMap[resourceId]);
    setValue(`rightsizingScope.${platform}.groupIds`, groupIds, { shouldDirty: true });
    trigger('rightsizingScope');
  };

  return (
    <VStack
      border={`1px solid ${theme.palette.gray.border}`}
      borderRadius={2}
      flex={1}
      bgcolor={theme.palette.white.main}
    >
      <HStack
        gap={2}
        px={5}
        py={2}
        borderBottom={`1px solid ${theme.palette.gray.border}`}
        alignItems="center"
      >
        {IconComponent}
        <Typography variant="bodyBold">{title}</Typography>
      </HStack>
      <HStack px={5} py={4}>
        <Controller
          control={control}
          name={fieldName}
          render={({ field, fieldState: { error } }) => (
            <MultiSelect
              {...field}
              label={label}
              options={options}
              searchPlaceholder={searchPlaceholder}
              selectPlaceholder={selectPlaceholder}
              configKey={configKey}
              wrapperSx={{ width: '100%' }}
              helperText={error?.message}
              onChange={({ value }) => handleResourceChange(value, field.onChange)}
            />
          )}
        />
      </HStack>
    </VStack>
  );
}
