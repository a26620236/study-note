'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Box } from '@mui/material';
import { sendGAEvent } from '@next/third-parties/google';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, type SubmitHandler } from 'react-hook-form';

import { AWSBillingAuthentication } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/aws/AWSBillingAuthentication';
import { AWSBillingErrorDialog } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/aws/AWSBillingErrorDialog';
import AWSBillingGuideline from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/aws/AWSBillingGuideline';
import { AWSBillingIntegrationBottomBar } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/aws/AWSBillingIntegrationBottomBar';
import { BillingIntegrationStep } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/constants';
import {
  useAWSBillingIntegrationForm,
  type AWSBillingIntegrationForm,
} from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/hooks/useAWSBillingIntegrationForm';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import { EVENT_RESOURCE_LIST, ORG_SETTINGS_PATHS, PlatformsValue } from '@constants';
import {
  authorizationListQueryKey,
  AWSBillingIntegrationStatus,
  AWSBillingPermissionCheckStatus,
  usePostAWSIntegration,
  usePostAWSPermissionCheck,
} from '@hooks-api';

const FORM_ID = 'awsBillingIntegrationForm';

export type AWSBillingError = 'Quota Exceeded' | 'Permission Denied' | null;

export function AWSBillingIntegration() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<BillingIntegrationStep>(BillingIntegrationStep.Guide);
  const [isPermissionChecked, setIsPermissionChecked] = useState(false);
  const [isOpenAWSErrorDialog, setIsOpenAWSErrorDialog] = useState(false);
  const [awsError, setAWSError] = useState<AWSBillingError>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const formMethods = useAWSBillingIntegrationForm();

  const { mutateAsync: permissionCheckMutation, isPending: isPermissionCheckPending } =
    usePostAWSPermissionCheck();
  const { mutateAsync: integrationMutation, isPending: isIntegrationPending } =
    usePostAWSIntegration();

  const handlePermissionCheck = async () => {
    const formData = formMethods.getValues();
    try {
      await permissionCheckMutation(formData, {
        onSuccess: () => {
          setIsPermissionChecked(true);
        },
        onError: (error) => {
          const { errorCode } = error.response?.data.data.detail ?? {};
          if (
            errorCode?.includes(AWSBillingPermissionCheckStatus.CurLimitError) ||
            errorCode?.includes(AWSBillingPermissionCheckStatus.FocusLimitError)
          ) {
            setAWSError('Quota Exceeded');
          } else {
            setAWSError('Permission Denied');
          }
          setIsOpenAWSErrorDialog(true);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandler: SubmitHandler<AWSBillingIntegrationForm> = async (data) => {
    try {
      if (!isPermissionChecked) return;
      await integrationMutation(data, {
        onSuccess: () => {
          sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_SUBMIT_RESOURCE, {
            platform: PlatformsValue.AWS,
          });
          queryClient.invalidateQueries({ queryKey: authorizationListQueryKey });
          router.push(ORG_SETTINGS_PATHS.authorizationList.pathname);
        },
        onError: (error) => {
          const { errorCode } = error.response?.data.data.detail ?? {};
          if (
            errorCode?.includes(AWSBillingIntegrationStatus.CurCreateBillingExportFailed) ||
            errorCode?.includes(AWSBillingIntegrationStatus.FocusCreateBillingExportFailed)
          ) {
            setAWSError('Quota Exceeded');
          } else {
            setAWSError('Permission Denied');
          }
          setIsOpenAWSErrorDialog(true);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Box ref={containerRef}>
        <form id={FORM_ID} onSubmit={formMethods.handleSubmit(submitHandler)}>
          {page === BillingIntegrationStep.Guide && <AWSBillingGuideline />}
          {page === BillingIntegrationStep.Authentication && <AWSBillingAuthentication />}
          <FixedBottomBarWrapper>
            <AWSBillingIntegrationBottomBar
              page={page}
              setPage={setPage}
              isPermissionChecked={isPermissionChecked}
              isPermissionCheckPending={isPermissionCheckPending}
              handlePermissionCheck={handlePermissionCheck}
              isIntegrationPending={isIntegrationPending}
              formId={FORM_ID}
            />
          </FixedBottomBarWrapper>
        </form>
        <AWSBillingErrorDialog
          open={isOpenAWSErrorDialog}
          onClose={() => setIsOpenAWSErrorDialog(false)}
          awsError={awsError}
        />
      </Box>
    </FormProvider>
  );
}
