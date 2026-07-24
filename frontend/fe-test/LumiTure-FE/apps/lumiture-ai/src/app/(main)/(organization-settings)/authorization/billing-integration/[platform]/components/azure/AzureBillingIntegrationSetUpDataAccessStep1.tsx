import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import Image from 'next/image';

import { Divider, Link, Typography } from '@mui/material';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { getStorageImageUrl } from '@shared/utils';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { MAIN_PATHS } from '@constants';

import { AzureBillingIntegrationStep } from '../constants';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
interface AzureBillingIntegrationSetUpDataAccessStep1Props {
  setStep: Dispatch<SetStateAction<AzureBillingIntegrationStep>>;
}

const LABELS = {
  setUpDataAccess: {
    title: 'Set Up Data Access (Subscription Reader)',
    notes: `**A critical final step is required for full functionality.**<br />**<span style="color: #FF403D">Failure to complete these steps will prevent LumiTure.ai from accessing the necessary Azure data.</span>**<br />Please finish the remaining steps so LumiTure.ai can securely access your Azure data and deliver valuable cloud spending insights.`,
  },
  step1: {
    title: 'Step 1: Grant LumiTure.ai Storage Blob Data Reader Permission',
    description1:
      '1\\. In the search bar, type **“Subscription”** and navigate to the corresponding page.',
    description2: '2\\. Click the subscription you created.',
    description3:
      '3\\. Select **“Access Control (IAM)”**. Then click **“+Add”** and then click **“Add role assignment”**.',
    description4: '4\\. Search for **Reader**, select it, and then click **“Next”**.',
    description5:
      '5\\. Click **“+ Select members“** and search for the **Lumiture** service principal. Then select that **Lumiture-App** service principal and click **“Select“**.',
    description6: '6\\. Click **“Review + Assign“**.',
    description7: '7\\. Within the **Review + Assign tab**, click **“Review + Assign“** again.',
    description8:
      '8\\. After assigning the role, you can see the **Lumiture-App** service principal with the **Reader** role.',
    description9: `9\\. Click **"Next"** to continue the next step: **Set Up Data Access (Storage Blob Reader & Event Subscription)**<br />&nbsp;&nbsp;&nbsp;&nbsp;(If all steps are complete, you may return to the <a href="${MAIN_PATHS.authorizationList.pathname}">Authorization List</a> to confirm the latest Azure authorization status.)`,
  },
  buttons: {
    next: 'Next',
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
  ul: ({ children }: PropsWithChildren) => (
    <ul style={{ margin: 0, paddingLeft: '32px' }}>{children}</ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
  ),
};

export function AzureBillingIntegrationSetUpDataAccessStep1({
  setStep,
}: AzureBillingIntegrationSetUpDataAccessStep1Props) {
  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* Set Up Data Access (Subscription Reader) */}
        <Typography variant="h5" color="text.secondary">
          {LABELS.setUpDataAccess.title}
        </Typography>

        <NoteBox
          variant="warning"
          content={
            <Markdown components={markdownComponentsConfig}>
              {LABELS.setUpDataAccess.notes}
            </Markdown>
          }
        />

        <Divider />

        {/* step 1 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.step1.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description1}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-1.png'
            )}
            alt="set up data access step1 image 1"
            width={1052}
            height={140}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-2.png'
            )}
            alt="set up data access step1 image 2"
            width={1052}
            height={256}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description3}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-3.png'
            )}
            alt="set up data access step1 image 3"
            width={1052}
            height={194}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description4}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-4.png'
            )}
            alt="set up data access step1 image 4"
            width={1052}
            height={500}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description5}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-5.png'
            )}
            alt="set up data access step1 image 5"
            width={1052}
            height={500}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description6}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-6.png'
            )}
            alt="set up data access step1 image 6"
            width={1052}
            height={502}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description7}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-7.png'
            )}
            alt="set up data access step1 image 7"
            width={1052}
            height={502}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description8}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step1_1-8.png'
            )}
            alt="set up data access step1 image 8"
            width={1052}
            height={482}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description9}</Markdown>
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={() => {
              setStep(AzureBillingIntegrationStep.SetUpDataAccessStep2);
            }}
          >
            {LABELS.buttons.next}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
