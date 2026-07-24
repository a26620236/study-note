import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Paper, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { HStack, MultiSelect, VStack } from '@lumiture-ui';
import { basicColor } from '@lumiture-ui/theme';

import { CompletionChip } from '@components/Chip/CompletionChip';
import { useGetRightsizingSettings } from '@hooks-api';

import {
  rightsizingScopeSchema,
  type RightsizingSettingsFormData,
} from '../../zod/rightsizingSettings.schema';
import { RightsizingScopeResource } from './RightsizingScopeResource';

const LABELS = {
  title: 'Rightsizing Scope',
  description:
    'First, select the groups for your rightsizing analysis. We will then list all authorized resources for your selected groups. \nNote that a resource can only belong to one scope at a time to prevent logical conflicts.',
};

export function RightsizingScope() {
  const { control, getValues, watch, trigger } = useFormContext<RightsizingSettingsFormData>();

  const paramScopeId = useSearchParams().get('scopeId');

  const isGroupsCompleted = rightsizingScopeSchema.safeParse(watch('rightsizingScope')).success;

  // 為了讓multiselect關閉後，把值記錄起來，並給RightsizingScopeResource props使用
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  const { data: settings } = useGetRightsizingSettings(paramScopeId);
  const { groups = [], scopes = [] } = settings?.data ?? {};
  const scopeId = paramScopeId ?? scopes[0]?.scopeId;

  const groupOptions = useMemo(
    () =>
      groups.map((group) => ({
        id: group.groupId,
        name: group.groupName,
      })),
    [groups]
  );

  const selectedGroupIdsFromData = useMemo(
    () =>
      groups.reduce<string[]>((acc, group) => {
        if (group.assigned) acc.push(group.groupId);
        return acc;
      }, []),
    [groups]
  );

  useEffect(() => {
    setSelectedGroupIds(selectedGroupIdsFromData);
  }, [selectedGroupIdsFromData]);

  const handleGroupClose = async () => {
    if (!scopeId) return;
    const scopeGroups = getValues('rightsizingScope.groups');
    setSelectedGroupIds(scopeGroups);
    if (scopeGroups.length === 0) {
      // 如果沒有選擇群組，API不會觸發驗證，所以需要手動觸發
      await trigger('rightsizingScope');
    }
  };

  return (
    <Paper sx={{ padding: '24px' }}>
      <VStack gap={4}>
        <HStack gap={2} alignItems="center">
          <Typography variant="h5">{LABELS.title}</Typography>
          <CompletionChip completed={isGroupsCompleted} />
        </HStack>
        <Typography variant="caption" color="text.secondary" whiteSpace="pre-line">
          {LABELS.description}
        </Typography>
        <VStack gap={4} p={4} bgcolor={basicColor.primary.skyBlue[10]} borderRadius={2}>
          <Controller
            name="rightsizingScope.groups"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                {...field}
                label="Groups"
                configKey="groups"
                selectPlaceholder="Select Groups"
                searchPlaceholder="Search Groups"
                value={field.value}
                options={groupOptions}
                onChange={({ value }) => field.onChange(value)}
                helperText={error?.message}
                handleClose={handleGroupClose}
              />
            )}
          />
          <RightsizingScopeResource scopeId={scopeId} selectedGroupIds={selectedGroupIds} />
        </VStack>
      </VStack>
    </Paper>
  );
}
