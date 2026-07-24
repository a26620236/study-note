import { useState, type Dispatch, type SetStateAction } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Divider, Typography } from '@mui/material';
import { useFormContext, type FieldErrors, type SubmitHandler } from 'react-hook-form';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { getAxiosError, getStorageImageUrl, popErrorToast, popSuccessToast } from '@shared/utils';
import { useScrollToFirstError } from '@shared/hooks';

import { CopyArea } from '@components/CopyArea';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { ORG_SETTINGS_PATHS } from '@constants';
import { useGetAwsExternalId, usePostAWSUsageIntegration } from '@hooks-api';

import {
  AwsUsageIntegrationErrorCode,
  AwsUsageIntegrationFieldErrorType,
  AwsUsageIntegrationSteps,
  type AwsUsageIntegrationError,
  type AwsUsageIntegrationFieldError,
} from '../../constants/usageIntegration';
import type {
  AWSUsageIntegrationForm,
  ValidatedAWSUsageIntegrationData,
} from '../../hooks/useAWSUsageIntegrationForm';
import { AWSAuthorizationInput } from './AWSAuthorizationInput';
import { AWSUsageIntegrationErrorDialog } from './AWSUsageIntegrationErrorDialog';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
interface AWSUsageIntegrationAuthorizationProps {
  setStep: Dispatch<SetStateAction<AwsUsageIntegrationSteps>>;
}

const LABELS = {
  usageDataAuthorization: {
    title: 'AWS Usage Data Authorization',
    description: 'Please furnish the following information obtainable from your AWS account.',
    inputs: {
      stacksetName: {
        label: 'StackSet Name',
        placeholder: 'e.g. LumiTureAccountMemberMonitoringSet',
      },
      roleName: {
        label: 'Member Management Role Name',
        placeholder: 'e.g. LumiTureAccountMemberMonitoringRole',
      },
      accountId: {
        label: 'AWS Management Account ID',
        placeholder: 'e.g. 123456789012',
      },
      externalId: {
        label: 'External ID from LumiTure.ai',
        placeholder: 'e.g. xdRppjI5oI7a',
      },
    },
  },
  note: 'If you are unable to find the information mentioned above on AWS, please refer to the following navigations.',
  guide: {
    whereToFindStackSetAndMemberManagementRoleName: {
      title: 'Where to Find StackSet and Member Management Role Name',
      description1:
        '1. Navigate to <a href="https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacksets" style="color: #0B6DD7">StackSets</a> page under **“CloudFormation”**.',
      description2:
        '2.Finding the necessary values on the Stack set details page: Parameters section. **Copy** the values as shown below.',
    },
    whereToFindManagementAccountId: {
      title: 'Where to Find AWS Management Account ID',
      description: `Navigate to <a href="https://console.aws.amazon.com/organizations/home?region=us-east-1#/accounts" style="color: #0B6DD7">AWS Organizations</a> page, find the account with **“management account“** tag, then copy the 12-digit numbers. <br /><span style="color: #B3B3B3">(Please ensure you are signed in to the correct AWS account.)</span>`,
    },
    whereToFindExternalId: {
      title: 'Where to Find External ID',
      description: 'Please copy the ID below.',
    },
    externalId: 'External ID',
  },
  buttons: {
    integrate: 'Integrate',
    backToGuide: 'Back to Grant Final Access Guide',
  },
  submit: {
    success: 'Access granted successfully.',
    error: 'Unable to grant access. Please try again later.',
  },
  apiResponseErrors: {
    [AwsUsageIntegrationFieldErrorType.AccountIdInvalid]: 'Invalid account ID',
    [AwsUsageIntegrationFieldErrorType.ExternalIdInvalid]: 'Invalid External ID',
    [AwsUsageIntegrationFieldErrorType.StacksetNameDuplicate]: 'StackSet name already exists',
  },
};

export function AWSUsageIntegrationAuthorization({
  setStep,
}: AWSUsageIntegrationAuthorizationProps) {
  const router = useRouter();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [usageIntegrationError, setUsageIntegrationError] =
    useState<AwsUsageIntegrationError | null>(null);
  const { handleSubmit, formState, setError } = useFormContext<ValidatedAWSUsageIntegrationData>();
  const { isSubmitting } = formState;

  const { mutateAsync: postAWSUsageIntegration } = usePostAWSUsageIntegration();
  const scrollToFirstError = useScrollToFirstError();

  const { data: awsExternalIdData, isLoading: isLoadingAwsExternalId } = useGetAwsExternalId();
  const externalId = awsExternalIdData?.data.externalId || '';

  const handleSubmitAWSUsageIntegration: SubmitHandler<ValidatedAWSUsageIntegrationData> = async (
    data
  ) => {
    try {
      await postAWSUsageIntegration(data);
      popSuccessToast({
        description: LABELS.submit.success,
      });
      router.push(ORG_SETTINGS_PATHS.authorizationList.pathname);
    } catch (error: unknown) {
      const fieldErrorData = getAxiosError<
        AwsUsageIntegrationErrorCode.BadRequest,
        AwsUsageIntegrationFieldError
      >(error);
      if (fieldErrorData?.code === AwsUsageIntegrationErrorCode.BadRequest) {
        const { accountId, externalId } = fieldErrorData.detail;
        const errors: Partial<Record<keyof AWSUsageIntegrationForm, { message: string }>> = {};
        if (accountId) {
          const errorMessage = LABELS.apiResponseErrors[accountId[0]];
          setError('accountId', { message: errorMessage });
          errors.accountId = { message: errorMessage };
        }
        if (externalId) {
          const errorMessage = LABELS.apiResponseErrors[externalId[0]];
          setError('externalId', { message: errorMessage });
          errors.externalId = { message: errorMessage };
        }
        if (Object.keys(errors).length > 0) {
          scrollToFirstError(errors);
        }
        return;
      }

      const integrationErrorData = getAxiosError<
        AwsUsageIntegrationErrorCode.Conflict,
        AwsUsageIntegrationError
      >(error);
      if (integrationErrorData?.code === AwsUsageIntegrationErrorCode.Conflict) {
        setUsageIntegrationError(integrationErrorData.detail);
        setIsErrorDialogOpen(true);
        return;
      }

      popErrorToast({ description: LABELS.submit.error });
    }
  };

  const handleSubmitError = (error: FieldErrors<ValidatedAWSUsageIntegrationData>) => {
    scrollToFirstError(error);
  };

  const markdownComponentsConfig = {
    p: ({ children }: { children?: React.ReactNode }) => (
      <Typography component="span" variant="body1">
        {children}
      </Typography>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
    ),
  };

  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* AWS Usage Data Authorization */}
        <VStack sx={{ gap: 4 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.usageDataAuthorization.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {LABELS.usageDataAuthorization.description}
          </Typography>
          <VStack sx={{ gap: 2 }}>
            <AWSAuthorizationInput
              name="stacksetName"
              label={LABELS.usageDataAuthorization.inputs.stacksetName.label}
              placeholder={LABELS.usageDataAuthorization.inputs.stacksetName.placeholder}
            />
            <AWSAuthorizationInput
              name="roleName"
              label={LABELS.usageDataAuthorization.inputs.roleName.label}
              placeholder={LABELS.usageDataAuthorization.inputs.roleName.placeholder}
            />
            <AWSAuthorizationInput
              name="accountId"
              label={LABELS.usageDataAuthorization.inputs.accountId.label}
              placeholder={LABELS.usageDataAuthorization.inputs.accountId.placeholder}
            />
            <AWSAuthorizationInput
              name="externalId"
              label={LABELS.usageDataAuthorization.inputs.externalId.label}
              placeholder={LABELS.usageDataAuthorization.inputs.externalId.placeholder}
            />
          </VStack>
        </VStack>

        <Divider />

        <NoteBox variant="info" content={<Typography variant="body1">{LABELS.note}</Typography>} />

        {/* Where to Find StackSet and Member Management Role Name */}
        <VStack sx={{ gap: 2, mt: 4 }}>
          <Typography variant="h6">
            {LABELS.guide.whereToFindStackSetAndMemberManagementRoleName.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.guide.whereToFindStackSetAndMemberManagementRoleName.description1}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_authorization_1.png'
            )}
            alt="where to find stack set and member management role name"
            width={1052}
            height={188}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.guide.whereToFindStackSetAndMemberManagementRoleName.description2}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_authorization_2.png'
            )}
            alt="where to find stack set and member management role name"
            width={1052}
            height={372}
          />
        </VStack>

        {/* Where to Find AWS Management Account ID */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h6">{LABELS.guide.whereToFindManagementAccountId.title}</Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.guide.whereToFindManagementAccountId.description}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_authorization_3.png'
            )}
            alt="where to find aws management account id"
            width={1052}
            height={174}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_authorization_4.png'
            )}
            alt="where to find aws management account id"
            width={1052}
            height={610}
          />
        </VStack>

        {/* Where to Find External ID */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h6">{LABELS.guide.whereToFindExternalId.title}</Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.guide.whereToFindExternalId.description}
          </Markdown>
          <CopyArea
            label={LABELS.guide.externalId}
            value={externalId}
            isLoading={isLoadingAwsExternalId}
          />
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            variant="link"
            startIcon={<Icon name="arrow_circle_left" />}
            onClick={() => setStep(AwsUsageIntegrationSteps.GUIDE)}
          >
            <Typography variant="bodyBold">{LABELS.buttons.backToGuide}</Typography>
          </Button>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={handleSubmit(handleSubmitAWSUsageIntegration, handleSubmitError)}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {LABELS.buttons.integrate}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
      <AWSUsageIntegrationErrorDialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        errorType={usageIntegrationError}
      />
    </>
  );
}
