'use client';

import { useSearchParams } from 'next/navigation';

import LockIcon from '@mui/icons-material/Lock';
import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';

import { HStack, Input, VStack } from '@lumiture-ui';
import { FOCUSIcon } from '@lumiture-ui/SvgIcon';

import { LumiTagStatusChip } from '@app/(main)/(organization-settings)/lumitag/components/LumiTagStatusChip';
import { SuggestAutocomplete } from '@components/Autocomplete/SuggestAutocomplete';
import { useGetLumiTagList, type LumiTagStatus } from '@hooks-api';

import { RECOMMENDED_KEYS } from '../../constant/lumiTag';
import { useTagKeyNameValidation } from '../hooks/useTagKeyNameValidation';
import type { LumiTagFormData } from '../zod/lumiTagSettings.schema';

interface LumiTagKeySectionProps {
  currentStatus?: LumiTagStatus.Active | LumiTagStatus.Inactive;
}

const LABELS = {
  sectionTitle: 'Tag Key',
  inputPlaceholder: 'e.g., environment, cost-center, owner',
  inputHelperText:
    'Use lowercase letters, numbers, and hyphens. e.g., cost-center. Tag key name cannot be changed once applied.',
  recommendedHeader: 'FinOps Recommended',
  editDisabledTooltip:
    'The Key Name cannot be changed once established to ensure data consistency.',
};

const renderRecommendedHeader = (group: string) => (
  <HStack gap={2} alignItems="center" px="9px" py={2}>
    <FOCUSIcon sx={{ fontSize: 16 }} />
    <Typography variant="buttonBold1">{group}</Typography>
  </HStack>
);

export function LumiTagKeySection({ currentStatus }: LumiTagKeySectionProps) {
  const searchParams = useSearchParams();
  const tagId = searchParams.get('tagId') ?? undefined;
  const isEditMode = Boolean(tagId);

  const { data: listData } = useGetLumiTagList();
  const existingNames = new Set((listData?.data.tags ?? []).map((tag) => tag.name.toLowerCase()));

  const { control } = useFormContext<LumiTagFormData>();
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: 'name' });

  const { errorMessage: duplicateError } = useTagKeyNameValidation({
    name: field.value,
    isEditMode,
  });

  const displayError = error?.message ?? duplicateError;

  const options = RECOMMENDED_KEYS.map((key) => ({
    label: key,
    group: LABELS.recommendedHeader,
    disabled: existingNames.has(key.toLowerCase()),
    tag: 'Existed',
  }));

  return (
    <Paper sx={{ p: '24px 24px 46px 24px', borderRadius: 2 }} data-testid="lumiTag-key-section">
      <VStack sx={{ gap: 2 }}>
        <HStack sx={{ alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">{LABELS.sectionTitle}</Typography>
          {isEditMode && currentStatus && <LumiTagStatusChip status={currentStatus} />}
        </HStack>

        <Box>
          {isEditMode ? (
            <Tooltip title={LABELS.editDisabledTooltip} placement="top">
              <Box>
                <Input
                  id={field.name}
                  value={field.value}
                  disabled
                  placeholder={LABELS.inputPlaceholder}
                  error={Boolean(displayError)}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: <LockIcon sx={{ fontSize: 18, color: 'text.disabled' }} />,
                    },
                    formHelperText: { error: Boolean(displayError) },
                  }}
                  helperText={displayError ?? LABELS.inputHelperText}
                  dataTestId="lumiTag-key-input"
                />
              </Box>
            </Tooltip>
          ) : (
            <SuggestAutocomplete
              options={options}
              value={field.value}
              onChange={field.onChange}
              placeholder={LABELS.inputPlaceholder}
              error={Boolean(displayError)}
              helperText={displayError ?? LABELS.inputHelperText}
              renderGroupHeader={renderRecommendedHeader}
              textFieldProps={{
                id: field.name,
                slotProps: {
                  htmlInput: { 'data-testid': 'lumiTag-key-input' },
                },
              }}
            />
          )}
        </Box>
      </VStack>
    </Paper>
  );
}
