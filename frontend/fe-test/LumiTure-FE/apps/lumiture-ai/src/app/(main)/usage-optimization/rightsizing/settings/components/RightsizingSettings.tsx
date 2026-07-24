'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, type FieldErrors, type SubmitHandler } from 'react-hook-form';

import { Button, HStack, VStack } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';
import { useScrollToFirstError } from '@shared/hooks';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import { OPTIMIZATION_PATHS } from '@constants';
import { useRouteProtection } from '@hooks';
import {
  getRightsizingSettingsQueryKey,
  ScopeStatusEnum,
  useGetRightsizingSettings,
  usePostRightsizingSettings,
  usePutRightsizingSettings,
} from '@hooks-api';

import { useRightsizingSettingsForm } from '../hooks/useRightsizingSettingsForm';
import { transformFormDataToPayload } from '../utils/transformFormDataToPayload';
import type { ValidatedRightsizingSettingsData } from '../zod/rightsizingSettings.schema';
import { RightsizingAdvancedSettings } from './RightsizingAdvancedSettings/RightsizingAdvancedSettings';
import { RightsizingCriteriaSettings } from './RightsizingCriteriaSettings';
import { RightsizingScope } from './RightsizingScope/RightsizingScope';
import { RightsizingSettingsSkeleton } from './RightsizingSettingsSkeleton';
import { RightsizingSettingsToolbar } from './RightsizingSettingsToolbar';

const LABELS = {
  actionButtons: {
    reset: 'Reset',
    discardChanges: 'Discard Changes',
    save: {
      label: 'Save',
      tooltip:
        'All existing recommendations are automatically updated by your new settings, except for manually-set “End of tracking” dates.',
    },
  },
  submit: {
    getSuccessMessage: (scopeName: string) => `${scopeName} updated successfully.`,
    getErrorMessage: (scopeName: string) =>
      `Unable to update ${scopeName}. Please try again later.`,
  },
};

export function RightsizingSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentScopeId = useSearchParams().get('scopeId');
  const { data: rightsizingSettingsData, isLoading } = useGetRightsizingSettings(currentScopeId);
  const { mutateAsync: putRightsizingSettings } = usePutRightsizingSettings(
    currentScopeId || rightsizingSettingsData?.data.scopes[0]?.scopeId
  );
  const { mutateAsync: postRightsizingSettings } = usePostRightsizingSettings();

  const formMethods = useRightsizingSettingsForm();

  const scrollToFirstError = useScrollToFirstError();

  const { isDirty, isSubmitting } = formMethods.formState;

  useRouteProtection({
    isBlock: isDirty && !isSubmitting,
  });

  const currentScope =
    rightsizingSettingsData?.data.scopes.find((scope) => scope.scopeId === currentScopeId) ??
    rightsizingSettingsData?.data.scopes[0];

  const { scopeStatus, scopeName } = currentScope ?? {};

  const handleSubmitSuccess: SubmitHandler<ValidatedRightsizingSettingsData> = async (data) => {
    try {
      /**
       * If the current scope is the draft scope, create a new scope
       * Otherwise, update the existing scope
       */
      const payload = transformFormDataToPayload(data);
      if (scopeStatus === ScopeStatusEnum.Draft) await postRightsizingSettings(payload);
      else await putRightsizingSettings(payload);

      /**
       * Even if the RIGHTSIZING_SETTINGS_DRAFT_SCOPE_ID is the same, we may get different scope name after creating a new scope.
       * Therefore, we need to invalidate the query after creating and updating the scope.
       */
      queryClient.invalidateQueries({ queryKey: getRightsizingSettingsQueryKey(currentScopeId) });
      popSuccessToast({ description: LABELS.submit.getSuccessMessage(scopeName ?? '') });
      router.push(OPTIMIZATION_PATHS.usageOptimization.pathname);
    } catch (error) {
      console.error(error);
      popErrorToast({ description: LABELS.submit.getErrorMessage(scopeName ?? '') });
    }
  };

  const handleSubmitError = (error: FieldErrors<ValidatedRightsizingSettingsData>) => {
    scrollToFirstError(error);
  };

  const handleDiscardChanges = () => {
    router.push(OPTIMIZATION_PATHS.usageOptimization.pathname);
  };

  if (isLoading) return <RightsizingSettingsSkeleton />;

  const ActionButtons = () => (
    <FixedBottomBarWrapper>
      <HStack sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Button
          size="small"
          variant="link"
          sx={{
            '&.MuiButton-link': {
              fontWeight: 700,
            },
          }}
          data-testid="reset-button"
          onClick={() => formMethods.reset()}
        >
          {LABELS.actionButtons.reset}
        </Button>
        <HStack sx={{ gap: 4 }}>
          <Button variant="outlined" onClick={handleDiscardChanges}>
            {LABELS.actionButtons.discardChanges}
          </Button>
          <Button
            type="submit"
            tooltipProps={{ title: LABELS.actionButtons.save.tooltip }}
            disabled={isSubmitting || !isDirty}
          >
            {LABELS.actionButtons.save.label}
          </Button>
        </HStack>
      </HStack>
    </FixedBottomBarWrapper>
  );

  return (
    <FormProvider {...formMethods}>
      <VStack
        sx={{ pb: '44px', gap: 5 }}
        component="form"
        onSubmit={formMethods.handleSubmit(handleSubmitSuccess, handleSubmitError)}
      >
        <RightsizingSettingsToolbar />
        <RightsizingScope />
        <RightsizingCriteriaSettings />
        <RightsizingAdvancedSettings />
        <ActionButtons />
      </VStack>
    </FormProvider>
  );
}
