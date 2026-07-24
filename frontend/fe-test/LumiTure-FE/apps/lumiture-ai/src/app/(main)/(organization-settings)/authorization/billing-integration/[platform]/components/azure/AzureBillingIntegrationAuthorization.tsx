import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import Image from 'next/image';

import { Divider, Link, Typography } from '@mui/material';
import { useFormContext, type FieldErrors, type SubmitHandler } from 'react-hook-form';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { getAxiosError, getStorageImageUrl, popErrorToast, popSuccessToast } from '@shared/utils';
import { useScrollToFirstError } from '@shared/hooks';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { useRouteProtection } from '@hooks';
import {
  AzureBillingIntegrationAuthorizationErrorCode,
  SubscriptionIdError,
  TenantIdError,
  usePostAzureBillingIntegration,
  type AzureBillingIntegrationAuthorizationError,
} from '@hooks-api';

import type { AzureBillingIntegrationForm } from '../../hooks/useAzureBillingIntegrationForm';
import { AzureBillingIntegrationStep } from '../constants';
import { AzureAuthorizationInput } from './AzureAuthorizationInput';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
interface AzureBillingIntegrationAuthorizationProps {
  setStep: Dispatch<SetStateAction<AzureBillingIntegrationStep>>;
}

const LABELS = {
  azureAuthorization: {
    title: 'Set Azure Authorization',
    description: 'Please furnish the following information obtainable from your Azure account.',
    note: 'If you are unable to find the information mentioned above on Azure, please refer to the following images for assistance.',
    input: {
      tenantId: {
        label: 'Tenant ID',
        placeholder: 'e.g. 1234567890',
      },
      subscriptionId: {
        label: 'Subscription ID',
        placeholder: 'e.g. 1234567890',
      },
    },
  },
  whereToFindTenantID: {
    title: 'Where to Find Tenant ID',
    description: `Go to <a href="https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview">Azure Overview</a> page. The Tenant ID will be displayed under Basic Information. <span style="color: #B3B3B3">(Please ensure you are signed in to the correct Azure account.)</span>`,
  },
  whereToFindSubscriptionID: {
    title: 'Where to Find Subscription ID',
    description: `Go to <a href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV2">Subscription</a> page. The Subscription ID will be displayed in the table. <span style="color: #B3B3B3">(Please ensure you are signed in to the correct Azure account.)</span>`,
  },
  buttons: {
    permissionCheckAndIntegrate: 'Permission Check and Integrate',
    backToAuthorizationGuide: 'Back to Authorization Guide',
  },
  submit: {
    success: `You're almost done! Please complete the Azure Data Access steps to unlock full LumiTure.ai functionality.`,
    error: 'Unable to integrate authorization. Please try again later.',
  },
  apiResponseErrors: {
    [TenantIdError.TenantIdInvalid]: 'Invalid Tenant ID',
    [SubscriptionIdError.SubscriptionIdInvalid]: 'Invalid Subscription ID',
    [SubscriptionIdError.SubscriptionAlreadyRegistered]: 'This ID is already registered.',
  },
};

const markdownComponentsConfig = {
  p: ({ children }: PropsWithChildren) => (
    <Typography component="span" variant="body1">
      {children}
    </Typography>
  ),
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => (
    <Link
      sx={{ textDecoration: 'underline', color: theme.palette.text.link }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ),
};

export function AzureBillingIntegrationAuthorization({
  setStep,
}: AzureBillingIntegrationAuthorizationProps) {
  const {
    handleSubmit,
    setError,
    formState: { isDirty, isSubmitting },
  } = useFormContext<AzureBillingIntegrationForm>();

  useRouteProtection({
    isBlock: isDirty && !isSubmitting,
  });

  const scrollToFirstError = useScrollToFirstError();

  const { mutateAsync: postAzureBillingIntegration } = usePostAzureBillingIntegration();

  const handleBadRequestError = (detail: AzureBillingIntegrationAuthorizationError) => {
    const { tenantId, subscriptionId } = detail;
    const errors: Partial<Record<keyof AzureBillingIntegrationForm, { message: string }>> = {};

    if (tenantId) {
      const errorMessage = LABELS.apiResponseErrors[tenantId[0]];
      setError('tenantId', { message: errorMessage });
      errors.tenantId = { message: errorMessage };
    }
    if (subscriptionId) {
      const errorMessage = LABELS.apiResponseErrors[subscriptionId[0]];
      setError('subscriptionId', { message: errorMessage });
      errors.subscriptionId = { message: errorMessage };
    }

    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
    }
  };

  const handleSubmitAzureBillingIntegration: SubmitHandler<AzureBillingIntegrationForm> = async (
    data
  ) => {
    try {
      const response = await postAzureBillingIntegration(data);

      if (response.success && 'data' in response && 'url' in response.data) {
        window.location.assign(response.data.url);
      } else {
        setStep(AzureBillingIntegrationStep.SetUpDataAccessStep1);
        popSuccessToast({
          description: LABELS.submit.success,
        });
      }
    } catch (error) {
      const errorData = getAxiosError<
        AzureBillingIntegrationAuthorizationErrorCode,
        AzureBillingIntegrationAuthorizationError
      >(error);
      if (errorData?.code === AzureBillingIntegrationAuthorizationErrorCode.BadRequest) {
        handleBadRequestError(errorData.detail);
      } else {
        popErrorToast({ description: LABELS.submit.error });
      }
    }
  };

  const handleSubmitError = (error: FieldErrors<AzureBillingIntegrationForm>) => {
    scrollToFirstError(error);
  };

  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* Azure Authorization */}
        <Typography variant="h5" color="text.secondary">
          {LABELS.azureAuthorization.title}
        </Typography>
        <Typography variant="body1">{LABELS.azureAuthorization.description}</Typography>
        <AzureAuthorizationInput
          name="tenantId"
          label={LABELS.azureAuthorization.input.tenantId.label}
          placeholder={LABELS.azureAuthorization.input.tenantId.placeholder}
        />
        <AzureAuthorizationInput
          name="subscriptionId"
          label={LABELS.azureAuthorization.input.subscriptionId.label}
          placeholder={LABELS.azureAuthorization.input.subscriptionId.placeholder}
        />

        <Divider />

        <NoteBox
          variant="info"
          content={<Typography variant="body1">{LABELS.azureAuthorization.note}</Typography>}
        />

        {/* Where to Find Tenant ID */}
        <VStack sx={{ gap: 4 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.whereToFindTenantID.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.whereToFindTenantID.description}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_authorization_1.png'
            )}
            alt="where to find tenant id"
            width={1052}
            height={352}
          />
        </VStack>

        {/* Where to Find Subscription ID */}
        <VStack sx={{ gap: 4 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.whereToFindSubscriptionID.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.whereToFindSubscriptionID.description}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_authorization_2.png'
            )}
            alt="where to find subscription id"
            width={1052}
            height={306}
          />
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            variant="link"
            startIcon={<Icon name="arrow_circle_left" />}
            onClick={() => {
              setStep(AzureBillingIntegrationStep.Guide);
            }}
          >
            <Typography variant="bodyBold">{LABELS.buttons.backToAuthorizationGuide}</Typography>
          </Button>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={handleSubmit(handleSubmitAzureBillingIntegration, handleSubmitError)}
          >
            {LABELS.buttons.permissionCheckAndIntegrate}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
