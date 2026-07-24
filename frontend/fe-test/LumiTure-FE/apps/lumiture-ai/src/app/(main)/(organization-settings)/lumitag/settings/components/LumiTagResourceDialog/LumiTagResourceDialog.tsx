import { useMemo, useState } from 'react';

import { Dialog, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { PreviewDetailType, useGetLumiTagPreviewDetail } from '@hooks-api';

import { UNTAGGED_NAME } from '../../constants/lumiTagPreview';
import { ALL_PLATFORMS } from '../../constants/lumiTagSettings';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { LumiTagResourceDialogSearch } from './LumiTagResourceDialogSearch';
import { LumiTagResourceDialogSkeleton } from './LumiTagResourceDialogSkeleton';
import { LumiTagResourceDialogTable } from './LumiTagResourceDialogTable';
import { LumiTagResourceDialogToolbar } from './LumiTagResourceDialogToolbar';

const LABELS = {
  title: 'Resource Matched To:',
  untaggedTitle: 'Untagged Resources',
  gotIt: 'Got it',
  searchPrefix: 'Search',
} as const;

interface LumiTagResourceDialogProps {
  open: boolean;
  valueName: string;
  onClose: () => void;
}

export function LumiTagResourceDialog({ open, valueName, onClose }: LumiTagResourceDialogProps) {
  const { getValues } = useFormContext<LumiTagFormData>();
  const formValues = getValues('values');
  const isUntagged = valueName === UNTAGGED_NAME;

  const selectionDisplayOrder = isUntagged
    ? -1
    : (formValues.find((formValue) => formValue.name === valueName)?.displayOrder ?? 0);

  const availablePlatforms = useMemo(
    () =>
      isUntagged
        ? [...ALL_PLATFORMS]
        : [
            ...new Set(
              formValues.flatMap((formValue) => formValue.scopes.map((scope) => scope.platform))
            ),
          ],
    [formValues, isUntagged]
  );
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformsValue>(availablePlatforms[0]);
  const [selectedToggleType, setSelectedToggleType] = useState<PreviewDetailType>(
    PreviewDetailType.BillingAccount
  );
  const [searchText, setSearchText] = useState('');

  function handlePlatformChange(platform: PlatformsValue) {
    setSelectedPlatform(platform);
    setSelectedToggleType(PreviewDetailType.BillingAccount);
  }

  const payload = useMemo(
    () => ({
      selectionDisplayOrder,
      groupBy: selectedToggleType,
      platform: selectedPlatform,
      values: formValues,
    }),
    [selectionDisplayOrder, selectedToggleType, selectedPlatform, formValues]
  );

  const { data: detailRes, isPending } = useGetLumiTagPreviewDetail(payload);

  const detailData = detailRes?.data;

  return (
    <Dialog open={open} sx={{ p: 6 }} slotProps={{ paper: { sx: { width: 1000 } } }}>
      <VStack>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
            {isUntagged ? LABELS.untaggedTitle : `${LABELS.title} ${valueName}`}
          </Typography>
          <Icon
            name="close"
            sx={{ color: 'text.secondary', cursor: 'pointer' }}
            onClick={onClose}
          />
        </HStack>
        {isPending ? (
          <LumiTagResourceDialogSkeleton />
        ) : (
          <VStack gap={2} mt={8}>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <LumiTagResourceDialogToolbar
                availablePlatforms={availablePlatforms}
                selectedPlatform={selectedPlatform}
                onPlatformChange={handlePlatformChange}
                selectedToggleType={selectedToggleType}
                onToggleTypeChange={setSelectedToggleType}
                setSearchText={setSearchText}
              />
              <LumiTagResourceDialogSearch
                selectedPlatform={selectedPlatform}
                selectedToggleType={selectedToggleType}
                itemCount={detailData?.itemCount}
                totalCost={detailData?.totalCost}
                setSearchText={setSearchText}
              />
            </HStack>
            <LumiTagResourceDialogTable
              breakdownData={detailData?.breakdown ?? []}
              searchText={searchText}
              selectedPlatform={selectedPlatform}
              selectedToggleType={selectedToggleType}
            />
          </VStack>
        )}
        <HStack justifyContent="flex-end" mt={2}>
          <Button variant="contained" onClick={onClose} disabled={isPending}>
            {LABELS.gotIt}
          </Button>
        </HStack>
      </VStack>
    </Dialog>
  );
}
