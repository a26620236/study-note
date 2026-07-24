'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { popSuccessToast } from '@shared/utils';

import { useAzureBillingIntegrationForm } from '../../hooks/useAzureBillingIntegrationForm';
import { AzureBillingIntegrationStep } from '../constants';
import { AzureBillingIntegrationAuthorization } from './AzureBillingIntegrationAuthorization';
import { AzureBillingIntegrationGuide } from './AzureBillingIntegrationGuide';
import { AzureBillingIntegrationSetUpDataAccessStep1 } from './AzureBillingIntegrationSetUpDataAccessStep1';
import { AzureBillingIntegrationSetUpDataAccessStep2 } from './AzureBillingIntegrationSetUpDataAccessStep2';

const LABELS = {
  successMessage: `You're almost done! Please complete the Azure Data Access steps to unlock full LumiTure.ai functionality.`,
};

export function AzureBillingIntegration() {
  const searchParams = useSearchParams();
  const stepFromSearchParams = Number(searchParams.get('step'));
  const isAzureAuthSuccessRedirect = Boolean(
    Number(searchParams.get('isAzureAuthSuccessRedirect'))
  );

  const getInitialStep = (): AzureBillingIntegrationStep => {
    // Mainly for the case that User successfully authorize Azure Service Principal and then redirect to this page
    // Maybe from User successfully authorize Azure Service Principal and then redirect to this page
    // Maybe from User already authorize Azure Service Principal and then redirect to this page
    // Maybe from Authorization List page and then redirect to this page
    if (isAzureAuthSuccessRedirect) {
      return AzureBillingIntegrationStep.SetUpDataAccessStep1;
    }
    if (stepFromSearchParams in AzureBillingIntegrationStep) {
      return stepFromSearchParams;
    }
    return AzureBillingIntegrationStep.Guide;
  };

  const [step, setStep] = useState<AzureBillingIntegrationStep>(getInitialStep());
  const formMethods = useAzureBillingIntegrationForm();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAzureAuthSuccessRedirect) return;

    // Todo: without timeout, the toast will not be displayed normally, need to research
    const timer = setTimeout(() => {
      popSuccessToast({ description: LABELS.successMessage });
    }, 100);

    return () => clearTimeout(timer);
  }, [isAzureAuthSuccessRedirect]);

  useEffect(() => {
    // scroll to top when step changes
    if (!containerRef.current) return;
    const scrollContainer = containerRef.current.parentElement;

    if (!scrollContainer) return;
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ padding: '0 0 24px 0' }} ref={containerRef}>
        {step === AzureBillingIntegrationStep.Guide && (
          <AzureBillingIntegrationGuide setStep={setStep} />
        )}
        {step === AzureBillingIntegrationStep.Authentication && (
          <AzureBillingIntegrationAuthorization setStep={setStep} />
        )}
        {step === AzureBillingIntegrationStep.SetUpDataAccessStep1 && (
          <AzureBillingIntegrationSetUpDataAccessStep1 setStep={setStep} />
        )}
        {step === AzureBillingIntegrationStep.SetUpDataAccessStep2 && (
          <AzureBillingIntegrationSetUpDataAccessStep2 />
        )}
      </Box>
    </FormProvider>
  );
}
