'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { sendGAEvent } from '@next/third-parties/google';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, type SubmitHandler } from 'react-hook-form';

import { Button, HStack } from '@lumiture-ui';

import { BillingIntegrationStep } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/constants';
import { GCPBillingAuthentication } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/gcp/GCPBillingAuthentication';
import { GCPBillingGuide } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/gcp/GCPBillingGuide';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import { EVENT_RESOURCE_LIST, ORG_SETTINGS_PATHS, PlatformsValue } from '@constants';
import { authorizationListQueryKey, usePostGCPBillingIntegration } from '@hooks-api';

import {
  useGCPBillingIntegrationForm,
  type GCPBillingIntegrationForm,
} from '../../hooks/useGCPBillingIntegrationForm';
import { GCPBillingIntegrationErrorDialog } from './GCPBillingIntegrationErrorDialog';

const FORM_ID = 'gcpBillingIntegrationForm';

const LABELS = {
  buttons: {
    goToSetGoogleAuthorization: 'Go to set Google Authorization',
    backToAuthorizationGuide: 'Back to Authorization Guide',
    integration: 'Integration',
  },
};

export function GCPBillingIntegration() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState<BillingIntegrationStep>(BillingIntegrationStep.Guide);
  const [isOpenGCPErrorDialog, setIsOpenGCPErrorDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const formMethods = useGCPBillingIntegrationForm();

  const { mutateAsync: gcpBillingIntegrationMutation, isPending: isGCPBillingIntegrationPending } =
    usePostGCPBillingIntegration();

  const handleSubmit: SubmitHandler<GCPBillingIntegrationForm> = async (data) => {
    try {
      await gcpBillingIntegrationMutation(data, {
        onSuccess: () => {
          sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_SUBMIT_RESOURCE, {
            platform: PlatformsValue.GCP,
          });
          queryClient.invalidateQueries({ queryKey: authorizationListQueryKey });
          router.push(ORG_SETTINGS_PATHS.authorizationList.pathname);
        },
        onError: (error) => {
          console.error(error);
          setIsOpenGCPErrorDialog(true);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Box ref={containerRef}>
        <form id={FORM_ID} onSubmit={formMethods.handleSubmit(handleSubmit)}>
          {page === BillingIntegrationStep.Guide && <GCPBillingGuide />}
          {page === BillingIntegrationStep.Authentication && <GCPBillingAuthentication />}
          <FixedBottomBarWrapper>
            {page === BillingIntegrationStep.Guide && (
              <Button
                sx={{ ml: 'auto', bgcolor: 'primary.main', color: 'white' }}
                onClick={() => {
                  sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_GO_RESOURCE_FORM, {
                    platform: PlatformsValue.GCP,
                  });
                  setPage(BillingIntegrationStep.Authentication);
                }}
              >
                {LABELS.buttons.goToSetGoogleAuthorization}
              </Button>
            )}
            {page === BillingIntegrationStep.Authentication && (
              <HStack justifyContent="space-between" width="100%">
                <Box
                  onClick={() => setPage(BillingIntegrationStep.Guide)}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    color: 'primary.main',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowCircleLeftIcon sx={{ fontSize: 20 }} />
                  <Typography sx={{ textDecoration: 'underline' }}>
                    {LABELS.buttons.backToAuthorizationGuide}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    isLoading={isGCPBillingIntegrationPending}
                    disabled={isGCPBillingIntegrationPending}
                    type="submit"
                    form={FORM_ID}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    {LABELS.buttons.integration}
                  </Button>
                </Box>
              </HStack>
            )}
          </FixedBottomBarWrapper>
        </form>
      </Box>
      <GCPBillingIntegrationErrorDialog
        open={isOpenGCPErrorDialog}
        onClose={() => setIsOpenGCPErrorDialog(false)}
      />
    </FormProvider>
  );
}
