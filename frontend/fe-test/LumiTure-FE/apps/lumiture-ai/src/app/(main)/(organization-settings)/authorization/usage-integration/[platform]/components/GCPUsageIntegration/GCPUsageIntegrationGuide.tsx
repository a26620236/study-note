import type { PropsWithChildren } from 'react';
import Image from 'next/image';

import { Divider, Link, Typography, useTheme } from '@mui/material';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import { CopyArea } from '@components/CopyArea';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';

import { GcpUsageIntegrationSteps } from '../../constants/usageIntegration';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LUMITURE_GCP_SERVICE_ACCOUNT =
  'lumiture-client@tw-rd-app-finops-prod.iam.gserviceaccount.com';

const LABELS = {
  sections: {
    guide: {
      title: 'Google Cloud Usage Data Authorization Guide',
      description1:
        'Please complete this step for full functionality of **Rightsizing** and **Recommendation** features.',
      description2: 'The update time of GCP data is several hours.',
      description3:
        'After you complete the GCP authentication process, it may take up to **1 day** to see your resources in the LumiTure.ai platform.',
      description4:
        'If “**Monitoring**” is not shown in the sidebar please change to the account that has the permission or contact the organization. The organization account can assign the role to the account.',
      description5:
        'This process will only export the monitoring data of resources linked to the corresponding **scoping projects**. <a href="https://docs.cloud.google.com/monitoring/settings#data-model">Learn More</a>',
    },
    prerequisites: {
      title: 'Prerequisites',
      description1:
        '**Please ensure that the Billing Account associated with your Scoping Project has already been authorized.**',
      description2:
        'To view the time-series data that can be charted or monitored within a project, your IAM role must include all the permissions of the Monitoring Viewer role **(roles/monitoring.viewer).**',
      description3:
        'To configure a metrics scope, you must be granted the <a href="https://cloud.google.com/iam/docs/roles-permissions/monitoring#monitoring.admin">Monitoring Admin</a> **(roles/monitoring.admin)** IAM role.',
    },
    recommendation: {
      title: 'Recommendation',
      description: `- Create or select the Google Cloud project *without any existing resources* to act as the **scoping project**.\n- Ensure that the scoping project is linked to the Billing Account where the Billing Authentication Flow has already been completed.`,
    },
    step1: {
      title: 'Step 1: Grant Access to Cloud Monitoring Projects and Add the Scoping Project',
      description1:
        '1\\. Select the project you want to designate as the scoping project. Please ensure that you can access the **“Monitoring”** page. Go to **“Monitoring”** and click **“Settings”**.',
      description2: '2\\. Navigate to the **“Metrics Scope“** tab. Click **“Add projects”**.',
      description3: '3\\. Select the projects you want to include in the metrics scope.',
      description4: '4\\. Confirm your selection and click **“Add projects“**.',
    },
    step2: {
      title: 'Step 2: Grant Access to Cloud Monitoring Projects and Add the Scoping Project',
      description1:
        '1\\. In the **“Monitoring”**, go to the **“Permissions”** page and click **“Grant Access”**.',
      description2: '2\\. Copy the service account below:',
      description3:
        '3\\. Paste it in the **New principals** blank, and assign the **“Monitoring Viewer”** role to the LumiTure.ai service account. Click **“Save“**.',
    },
    step3: {
      title: 'Step 3. Provide Information to LumiTure.ai',
      description: `1. Return to LumiTure.ai and click the **"Go to set Google Authorization"** button at the bottom of this page.\n2. On the next page, enter the following information in the designated fields:\n- Project ID`,
    },
    goToSetUsageDataAuthorization: 'Go to set Usage Data Authorization',
  },
};

interface GCPUsageIntegrationGuideProps {
  setStep: (step: GcpUsageIntegrationSteps) => void;
}

export function GCPUsageIntegrationGuide({ setStep }: GCPUsageIntegrationGuideProps) {
  const theme = useTheme();

  const markdownComponentsConfig = {
    p: ({ children }: PropsWithChildren) => (
      <Typography component="span" variant="body1">
        {children}
      </Typography>
    ),
    a: ({ children, href }: PropsWithChildren<{ href?: string }>) => (
      <Link
        sx={{ color: theme.palette.text.link, textDecoration: 'underline' }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link>
    ),
    ul: ({ children }: PropsWithChildren) => (
      <ul style={{ margin: 0, paddingLeft: '24px' }}>{children}</ul>
    ),
    ol: ({ children }: PropsWithChildren) => (
      <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
    ),
  };

  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* Guide */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.guide.title}
          </Typography>
          <NoteBox
            variant="info"
            content={
              <ul style={{ margin: 0, paddingLeft: '28px' }}>
                <li>
                  <Markdown components={markdownComponentsConfig}>
                    {LABELS.sections.guide.description1}
                  </Markdown>
                </li>
                <li>
                  <Markdown components={markdownComponentsConfig}>
                    {LABELS.sections.guide.description2}
                  </Markdown>
                  <Typography sx={{ color: theme.palette.error.main }}>
                    <Markdown components={markdownComponentsConfig}>
                      {LABELS.sections.guide.description3}
                    </Markdown>
                  </Typography>
                </li>
                <li>
                  <Markdown components={markdownComponentsConfig}>
                    {LABELS.sections.guide.description4}
                  </Markdown>
                </li>
                <li>
                  <Markdown components={markdownComponentsConfig}>
                    {LABELS.sections.guide.description5}
                  </Markdown>
                </li>
              </ul>
            }
          />
        </VStack>

        {/* Prerequisites */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.prerequisites.title}
          </Typography>
          <ol style={{ margin: 0, paddingLeft: '16px' }}>
            <li style={{ color: theme.palette.error.main, fontWeight: 700 }}>
              <Markdown components={markdownComponentsConfig}>
                {LABELS.sections.prerequisites.description1}
              </Markdown>
            </li>
            <li>
              <Markdown components={markdownComponentsConfig}>
                {LABELS.sections.prerequisites.description2}
              </Markdown>
            </li>
            <li>
              <Markdown components={markdownComponentsConfig}>
                {LABELS.sections.prerequisites.description3}
              </Markdown>
            </li>
          </ol>
        </VStack>

        {/* Recommendation */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.recommendation.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.recommendation.description}
          </Markdown>
        </VStack>

        <Divider />
        {/* Step 1 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.step1.title}
          </Typography>
          <VStack sx={{ gap: 2 }}>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step1.description1}
            </Markdown>
            <Image
              // Todo: get image from Google Cloud Storage
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/usage/gcp/google_guide_1-1.png'
              )}
              alt="go to the 'Permissions' page and click 'Grant Access'."
              width={1052}
              height={554}
            />
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step1.description2}
            </Markdown>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/usage/gcp/google_guide_1-2.png'
              )}
              alt="navigate to the 'Metrics Scope' tab. Click 'Add projects'."
              width={1052}
              height={436}
            />
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step1.description3}
            </Markdown>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/usage/gcp/google_guide_1-3.png'
              )}
              alt="select the projects you want to include in the metrics scope."
              width={1052}
              height={436}
            />
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step1.description4}
            </Markdown>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/usage/gcp/google_guide_1-4.png'
              )}
              alt="confirm your selection and click 'Add projects'."
              width={1052}
              height={556}
            />
          </VStack>
        </VStack>

        <Divider />
        {/* Step 2 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.step2.title}
          </Typography>
          <VStack sx={{ gap: 2 }}>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step2.description1}
            </Markdown>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/usage/gcp/google_guide_2-1.png'
              )}
              alt="navigate to the 'Metrics Scope' tab. Click 'Add projects'."
              width={1052}
              height={476}
            />
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step2.description2}
            </Markdown>
            <CopyArea value={LUMITURE_GCP_SERVICE_ACCOUNT} />

            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.step2.description3}
            </Markdown>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/usage/gcp/google_guide_2-2.png'
              )}
              alt="navigate to the 'Metrics Scope' tab. Click 'Add projects'."
              width={1052}
              height={554}
            />
          </VStack>
        </VStack>

        <Divider />
        {/* Step 3 */}
        <VStack sx={{ gap: 2, pb: 8 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.step3.title}
          </Typography>
          <VStack>
            <Markdown
              components={{
                ...markdownComponentsConfig,
                ul: ({ children }: PropsWithChildren) => <ul style={{ margin: 0 }}>{children}</ul>,
              }}
            >
              {LABELS.sections.step3.description}
            </Markdown>
          </VStack>
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={() => {
              setStep(GcpUsageIntegrationSteps.AUTHENTICATION);
            }}
          >
            {LABELS.sections.goToSetUsageDataAuthorization}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
