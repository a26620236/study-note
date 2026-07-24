'use client';

import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { GcpUsageIntegrationSteps } from '../../constants/usageIntegration';
import { useGCPUsageIntegrationForm } from '../../hooks/useGCPUsageIntegrationForm';
import { GCPUsageIntegrationAuthorization } from './GCPUsageIntegrationAuthorization';
import { GCPUsageIntegrationGuide } from './GCPUsageIntegrationGuide';

export function GCPUsageIntegration() {
  const [step, setStep] = useState<GcpUsageIntegrationSteps>(GcpUsageIntegrationSteps.GUIDE);
  const formMethods = useGCPUsageIntegrationForm();
  const containerRef = useRef<HTMLDivElement>(null);

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
        {step === GcpUsageIntegrationSteps.GUIDE && <GCPUsageIntegrationGuide setStep={setStep} />}
        {step === GcpUsageIntegrationSteps.AUTHENTICATION && (
          <GCPUsageIntegrationAuthorization setStep={setStep} />
        )}
      </Box>
    </FormProvider>
  );
}
