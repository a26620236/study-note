import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Divider, TextField, Typography } from '@mui/material';
import { Controller, useFormContext, type FieldErrors, type SubmitHandler } from 'react-hook-form';

import { AsteriskRed, Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { getAxiosError, getStorageImageUrl, popErrorToast, popSuccessToast } from '@shared/utils';
import { useScrollToFirstError } from '@shared/hooks';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { ORG_SETTINGS_PATHS } from '@constants';
import { usePostGCPUsageIntegration } from '@hooks-api';

import {
  GcpUsageIntegrationSteps,
  type GcpUsageIntegrationErrorTypes,
} from '../../constants/usageIntegration';
import type {
  GCPUsageIntegrationForm,
  ValidatedGCPUsageIntegrationData,
} from '../../hooks/useGCPUsageIntegrationForm';
import { GCPUsageIntegrationErrorDialog } from './GCPUsageIntegrationErrorDialog';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LABELS = {
  usageDataAuthorization: {
    title: 'Google Cloud Usage Data Authorization',
    description:
      'Please furnish the following information obtainable from your Google Cloud account.',
    input: {
      label: 'Scoping Project ID',
      placeholder: 'e.g. finops-monitor-scope-example',
    },
  },
  note: 'If you are unable to find the information mentioned above on GCP, please refer to the following images for assistance.',
  guide: {
    title: 'Where to Find Scoping Project ID',
    description: `1. Click the project selector in the header to open the **"Select a project"** dialog.  (Please ensure you are signed in to the correct Google account.)\n2. Locate your project by name.\n3. The **Project ID** will be displayed in the ID column.`,
  },
  buttons: {
    integrate: 'Integrate',
    backToGuide: 'Back to Grant Final Access Guide',
  },
  submit: {
    success: 'Access granted successfully.',
    error: 'Unable to grant access. Please try again later.',
  },
};

interface GCPUsageIntegrationAuthorizationProps {
  setStep: (step: GcpUsageIntegrationSteps) => void;
}

export function GCPUsageIntegrationAuthorization({
  setStep,
}: GCPUsageIntegrationAuthorizationProps) {
  const router = useRouter();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [usageIntegrationError, setusageIntegrationError] =
    useState<GcpUsageIntegrationErrorTypes | null>(null);
  const { control, handleSubmit, formState } = useFormContext<GCPUsageIntegrationForm>();
  const { isSubmitting } = formState;

  const { mutateAsync: postGCPUsageIntegration } = usePostGCPUsageIntegration();
  const scrollToFirstError = useScrollToFirstError();

  const handleSubmitGCPUsageIntegration: SubmitHandler<ValidatedGCPUsageIntegrationData> = async (
    data
  ) => {
    try {
      await postGCPUsageIntegration(data);
      popSuccessToast({
        description: LABELS.submit.success,
      });
      router.push(ORG_SETTINGS_PATHS.authorizationList.pathname);
    } catch (error: unknown) {
      const { code: errorCode } = getAxiosError<GcpUsageIntegrationErrorTypes>(error) ?? {};
      if (errorCode) {
        setusageIntegrationError(errorCode);
        setIsErrorDialogOpen(true);
      } else {
        popErrorToast({ description: LABELS.submit.error });
      }
    }
  };

  const handleSubmitError = (error: FieldErrors<ValidatedGCPUsageIntegrationData>) => {
    scrollToFirstError(error);
  };

  return (
    <>
      <VStack sx={{ gap: 8 }}>
        <VStack sx={{ gap: 4 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.usageDataAuthorization.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {LABELS.usageDataAuthorization.description}
          </Typography>
          <HStack sx={{ gap: '62px', alignItems: 'center', flexWrap: 'nowrap' }}>
            <HStack sx={{ alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Typography variant="bodyBold">
                {LABELS.usageDataAuthorization.input.label}
              </Typography>
              <AsteriskRed />
            </HStack>
            <Controller
              name="scopingProjectId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  size="small"
                  margin="none"
                  id={field.name}
                  value={field.value}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                  placeholder={LABELS.usageDataAuthorization.input.placeholder}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                    },
                  }}
                />
              )}
            />
          </HStack>
          <Divider />
          <NoteBox
            variant="info"
            content={<Typography variant="body1">{LABELS.note}</Typography>}
          />
        </VStack>
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h6">{LABELS.guide.title}</Typography>
          <Markdown
            components={{
              p: ({ children }: { children?: React.ReactNode }) => (
                <Typography component="span" variant="body1">
                  {children}
                </Typography>
              ),
              ol: ({ children }: { children?: React.ReactNode }) => (
                <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
              ),
            }}
          >
            {LABELS.guide.description}
          </Markdown>
          <Image
            // Todo: get image from Google Cloud Storage
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/gcp/google_guide_3-1.png'
            )}
            alt="Where to Find Scoping Project ID"
            width={1052}
            height={488}
          />
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            variant="link"
            startIcon={<Icon name="arrow_circle_left" />}
            onClick={() => setStep(GcpUsageIntegrationSteps.GUIDE)}
          >
            <Typography variant="bodyBold">{LABELS.buttons.backToGuide}</Typography>
          </Button>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={handleSubmit(handleSubmitGCPUsageIntegration, handleSubmitError)}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {LABELS.buttons.integrate}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
      <GCPUsageIntegrationErrorDialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        errorType={usageIntegrationError}
      />
    </>
  );
}
