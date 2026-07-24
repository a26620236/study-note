'use client';

import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { useRouteProtection } from '@hooks';

import { AwsUsageIntegrationSteps } from '../../constants/usageIntegration';
import { useAWSUsageIntegrationForm } from '../../hooks/useAWSUsageIntegrationForm';
import { AWSUsageIntegrationAuthorization } from './AWSUsageIntegrationAuthorization';
import { AWSUsageIntegrationGuide } from './AWSUsageIntegrationGuide';

export function AWSUsageIntegration() {
  const [step, setStep] = useState<AwsUsageIntegrationSteps>(AwsUsageIntegrationSteps.GUIDE);
  const formMethods = useAWSUsageIntegrationForm();
  const containerRef = useRef<HTMLDivElement>(null);

  const { isDirty, isSubmitting } = formMethods.formState;

  useRouteProtection({
    isBlock: isDirty && !isSubmitting,
  });

  useEffect(() => {
    // scroll to top when step changes
    if (containerRef.current) {
      const scrollContainer = containerRef.current.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [step]);

  return (
    <FormProvider {...formMethods}>
      <Box ref={containerRef}>
        {step === AwsUsageIntegrationSteps.GUIDE && <AWSUsageIntegrationGuide setStep={setStep} />}
        {step === AwsUsageIntegrationSteps.AUTHENTICATION && (
          <AWSUsageIntegrationAuthorization setStep={setStep} />
        )}
      </Box>
    </FormProvider>
  );
}
