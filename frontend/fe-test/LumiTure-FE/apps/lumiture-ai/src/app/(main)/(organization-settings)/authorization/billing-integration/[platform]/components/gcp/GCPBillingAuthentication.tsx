import type { PropsWithChildren } from 'react';
import Image from 'next/image';

import { Divider, Link, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import NoteBox from '@components/NoteBox';
import { useRouteProtection } from '@hooks';

import type { GCPBillingIntegrationForm } from '../../hooks/useGCPBillingIntegrationForm';
import { GCPAuthorizationInput } from './GCPAuthorizationInput';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LABELS = {
  title: 'Set GCP Authorization',
  description: 'Please furnish the following information obtainable from your GCP account.',
  sections: {
    billingAccountId: {
      label: 'Billing Account ID',
      placeholder: 'e.g. LLLLLL-UUUUUU-MMMMMM',
    },
    detailedUsageCost: {
      title: 'Detailed Usage Cost',
      projectId: {
        label: 'Project ID',
        placeholder: 'e.g. lumiture-project-id',
      },
      datasetId: {
        label: 'Dataset Name',
        placeholder: 'e.g. lumiture_billing_data',
      },
    },
    pricing: {
      title: 'Pricing',
      projectId: {
        label: 'Project ID',
        placeholder: 'e.g. lumiture-project-id',
      },
      datasetId: {
        label: 'Dataset Name',
        placeholder: 'e.g. lumiture-dataset-name',
      },
    },
  },
  note: 'If you are unable to find the information mentioned above on GCP, please refer to the following navigations.',
  guides: {
    billingAccountId: {
      title: 'Where to Find Billing Account ID',
      steps: `1. Navigate to [Billing – Google Cloud console](https://console.cloud.google.com/billing) page.\n2. The **Billing Account ID** will be showed in the table.`,
      image: {
        alt: 'Find GCP Billing ID',
      },
    },
    projectAndDataset: {
      title: 'Where to Find Project ID and Dataset Name',
      steps: `1. Navigate to BigQuery page\n2. Select the corresponding export project\n3. The **Project ID** and **Dataset Name** will be shown in the sidebar`,
      image: {
        alt: 'Find GCP Project ID and Dataset Name',
      },
    },
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
      sx={{ textDecoration: 'underline' }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
  ),
  li: ({ children }: PropsWithChildren) => <li style={{ fontSize: '14px' }}>{children}</li>,
};

export function GCPBillingAuthentication() {
  const {
    formState: { isDirty, isSubmitting },
  } = useFormContext<GCPBillingIntegrationForm>();

  useRouteProtection({ isBlock: isDirty && !isSubmitting });

  return (
    <VStack gap={4} alignItems="flex-start">
      {/* Form Section */}
      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
        {LABELS.title}
      </Typography>
      <Typography variant="body2">{LABELS.description}</Typography>

      <VStack gap={2} width="100%">
        <GCPAuthorizationInput
          name="billingAccountId"
          label={LABELS.sections.billingAccountId.label}
          placeholder={LABELS.sections.billingAccountId.placeholder}
        />

        <Typography variant="h6">{LABELS.sections.detailedUsageCost.title}</Typography>
        <VStack gap={2} marginLeft={5}>
          <GCPAuthorizationInput
            name="detailedUsageCost.projectId"
            label={LABELS.sections.detailedUsageCost.projectId.label}
            placeholder={LABELS.sections.detailedUsageCost.projectId.placeholder}
          />
          <GCPAuthorizationInput
            name="detailedUsageCost.datasetId"
            label={LABELS.sections.detailedUsageCost.datasetId.label}
            placeholder={LABELS.sections.detailedUsageCost.datasetId.placeholder}
          />
        </VStack>

        <Typography variant="h6">{LABELS.sections.pricing.title}</Typography>
        <VStack gap={2} marginLeft={5}>
          <GCPAuthorizationInput
            name="pricing.projectId"
            label={LABELS.sections.pricing.projectId.label}
            placeholder={LABELS.sections.pricing.projectId.placeholder}
          />
          <GCPAuthorizationInput
            name="pricing.datasetId"
            label={LABELS.sections.pricing.datasetId.label}
            placeholder={LABELS.sections.pricing.datasetId.placeholder}
          />
        </VStack>
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

      {/* Guide: Billing Account ID */}
      <VStack gap={1} width="100%">
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700 }}>
          {LABELS.guides.billingAccountId.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>
          {LABELS.guides.billingAccountId.steps}
        </Markdown>
        <Image
          src={getStorageImageUrl(
            bucketName,
            'images/authorization/billing/gcp/google_input_1.png'
          )}
          alt={LABELS.guides.billingAccountId.image.alt}
          width={1052}
          height={357}
        />
      </VStack>

      {/* Guide: Project ID and Dataset Name */}
      <VStack gap={1} width="100%">
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700 }}>
          {LABELS.guides.projectAndDataset.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>
          {LABELS.guides.projectAndDataset.steps}
        </Markdown>
        <Image
          src={getStorageImageUrl(
            bucketName,
            'images/authorization/billing/gcp/google_input_2.png'
          )}
          alt={LABELS.guides.projectAndDataset.image.alt}
          width={1052}
          height={497}
        />
      </VStack>
    </VStack>
  );
}
