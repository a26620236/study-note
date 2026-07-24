import Image from 'next/image';

import { Divider, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import NoteBox from '@components/NoteBox';
import { useRouteProtection } from '@hooks';

import type { AWSBillingIntegrationForm } from '../../hooks/useAWSBillingIntegrationForm';
import { AWSAuthorizationInput } from './AWSAuthorizationInput';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LABELS = {
  title: 'Set AWS Authorization',
  description: 'Please furnish the following information obtainable from your AWS account.',
  inputs: {
    accountId: {
      label: 'Your AWS Management Account ID',
      placeholder: 'e.g. 123456789012',
    },
    roleArn: {
      label: 'IAM Role Name',
      placeholder: 'e.g. arn:aws:iam::{account_id}:role/{role_name}',
    },
    policyArn: {
      label: 'IAM Policy Name',
      placeholder: 'e.g. arn:aws:iam::{account_id}:policy/{policy_name}',
    },
    externalId: {
      label: 'External ID from LumiTure.ai',
      placeholder: 'Please copy the external ID from previous page',
    },
  },
  note: 'If you are unable to find the information mentioned above on AWS, please refer to the following images for assistance.',
  guides: {
    roleInfo: {
      image: {
        alt: 'AWS Role Information Guide',
      },
    },
    policyInfo: {
      image: {
        alt: 'AWS Policy Information Guide',
      },
    },
  },
};

export function AWSBillingAuthentication() {
  const {
    formState: { isDirty, isSubmitting },
  } = useFormContext<AWSBillingIntegrationForm>();

  useRouteProtection({ isBlock: isDirty && !isSubmitting });

  return (
    <VStack gap={4} alignItems="flex-start">
      {/* Form Section */}
      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
        {LABELS.title}
      </Typography>
      <Typography variant="body2">{LABELS.description}</Typography>

      <VStack gap={2} width="100%">
        <AWSAuthorizationInput
          name="accountId"
          label={LABELS.inputs.accountId.label}
          placeholder={LABELS.inputs.accountId.placeholder}
          autoFocus
        />
        <AWSAuthorizationInput
          name="roleArn"
          label={LABELS.inputs.roleArn.label}
          placeholder={LABELS.inputs.roleArn.placeholder}
        />
        <AWSAuthorizationInput
          name="policyArn"
          label={LABELS.inputs.policyArn.label}
          placeholder={LABELS.inputs.policyArn.placeholder}
        />
        <AWSAuthorizationInput
          name="externalId"
          label={LABELS.inputs.externalId.label}
          placeholder={LABELS.inputs.externalId.placeholder}
        />
      </VStack>

      <Divider sx={{ width: '100%' }} />

      {/* Note */}
      <NoteBox
        variant="info"
        content={
          <Typography component="span" variant="body2">
            {LABELS.note}
          </Typography>
        }
      />

      {/* Guide Images */}
      <Image
        src={getStorageImageUrl(
          bucketName,
          'images/authorization/billing/aws/aws_input_role_1.png'
        )}
        alt={LABELS.guides.roleInfo.image.alt}
        width={1052}
        height={488}
      />
      <Image
        src={getStorageImageUrl(
          bucketName,
          'images/authorization/billing/aws/aws_input_role_2.png'
        )}
        alt={LABELS.guides.policyInfo.image.alt}
        width={1052}
        height={489}
      />
    </VStack>
  );
}
