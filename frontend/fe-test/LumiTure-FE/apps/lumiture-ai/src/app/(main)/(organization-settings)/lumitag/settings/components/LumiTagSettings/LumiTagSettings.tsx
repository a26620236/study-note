'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { FormProvider } from 'react-hook-form';

import { VStack } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';
import { useScrollToFirstError } from '@shared/hooks';

import { BOTTOM_BAR_HEIGHT } from '@components/layout/FixedBottomBarWrapper';
import { ORG_SETTINGS_PATHS } from '@constants';
import {
  getLumiTagListQueryKey,
  getLumiTagQueryKey,
  LumiTagStatus,
  useGetLumiTagList,
  usePostLumiTag,
  usePutLumiTag,
} from '@hooks-api';

import { useLumiTagSettingsForm } from '../../hooks/useLumiTagSettingsForm';
import { LumiTagActionButtons } from '../LumiTagActionButtons/LumiTagActionButtons';
import { LumiTagPreviewActionButton } from '../LumiTagActionButtons/LumiTagPreviewActionButton';
import { LumiTagAlert } from '../LumiTagAlert';
import { LumiTagKeySection } from '../LumiTagKeySection';
import { LumiTagPreview } from '../LumiTagPreview/LumiTagPreview';
import { LumiTagValueSection } from '../LumiTagValueSection';
import { LumiTagSettingsToolbar } from './LumiTagSettingsToolbar';

enum LumiTagView {
  Form = 'form',
  Preview = 'preview',
}

const SCROLL_DELAY_AFTER_COLLAPSE_MS = 350;

const LABELS = {
  saveSuccess: 'LumiTag saved successfully.',
  saveError: 'Failed to save LumiTag. Please try again.',
} as const;

export function LumiTagSettings() {
  const [view, setView] = useState<LumiTagView>(LumiTagView.Form);
  const searchParams = useSearchParams();
  const tagId = searchParams.get('tagId') ?? undefined;
  const router = useRouter();

  const { data: listData } = useGetLumiTagList();
  const currentStatus = tagId
    ? listData?.data.tags.find((tag) => tag.id === Number(tagId))?.status
    : undefined;

  const formMethods = useLumiTagSettingsForm();
  const { handleSubmit } = formMethods;

  const scrollToFirstError = useScrollToFirstError();

  const handleSubmitError = (errors: Parameters<typeof scrollToFirstError>[0]) => {
    setTimeout(() => scrollToFirstError(errors), SCROLL_DELAY_AFTER_COLLAPSE_MS);
  };

  const queryClient = useQueryClient();

  const postMutation = usePostLumiTag({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getLumiTagListQueryKey() });
      popSuccessToast({ description: LABELS.saveSuccess });
      router.push(ORG_SETTINGS_PATHS.lumiTag.pathname);
    },
    onError: () => popErrorToast({ description: LABELS.saveError }),
  });

  const putMutation = usePutLumiTag({
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: getLumiTagListQueryKey() });
      queryClient.invalidateQueries({ queryKey: getLumiTagQueryKey(variables.id) });
      popSuccessToast({ description: LABELS.saveSuccess });
      router.push(ORG_SETTINGS_PATHS.lumiTag.pathname);
    },
    onError: () => popErrorToast({ description: LABELS.saveError }),
  });

  const isSaving = postMutation.isPending || putMutation.isPending;

  function handleValidate(onSuccessCallback: () => void) {
    handleSubmit(onSuccessCallback, handleSubmitError)();
  }

  function handlePreviewClick() {
    handleSubmit(() => {
      setView(LumiTagView.Preview);
    }, handleSubmitError)();
  }

  const handleConfirm = (status: LumiTagStatus.Active | LumiTagStatus.Inactive) => {
    handleSubmit((validData) => {
      const payload = { ...validData, status };
      if (tagId === undefined) {
        postMutation.mutate(payload);
      } else {
        putMutation.mutate({ id: tagId, payload });
      }
    }, handleSubmitError)();
  };

  return (
    <FormProvider {...formMethods}>
      {view === LumiTagView.Form && (
        <form onSubmit={(event) => event.preventDefault()} data-testid="lumiTag-settings-form">
          <VStack sx={{ gap: 6, pb: `${BOTTOM_BAR_HEIGHT + 24}px` }}>
            <LumiTagSettingsToolbar />
            {currentStatus && <LumiTagAlert status={currentStatus} />}
            <LumiTagKeySection currentStatus={currentStatus} />
            <LumiTagValueSection />
          </VStack>
          <LumiTagActionButtons
            onPreview={handlePreviewClick}
            onValidate={handleValidate}
            onSaveInactive={() => handleConfirm(LumiTagStatus.Inactive)}
            isSaving={isSaving}
          />
        </form>
      )}
      {view === LumiTagView.Preview && (
        <>
          <LumiTagPreview />
          <LumiTagPreviewActionButton
            onBack={() => setView(LumiTagView.Form)}
            onSaveInactive={() => handleConfirm(LumiTagStatus.Inactive)}
            onSaveActive={() => handleConfirm(LumiTagStatus.Active)}
            isSaving={isSaving}
          />
        </>
      )}
    </FormProvider>
  );
}
