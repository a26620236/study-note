import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import Image from 'next/image';

import { Box, Divider, Link, Typography } from '@mui/material';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { MAIN_PATHS } from '@constants';

import { AzureBillingIntegrationStep } from '../constants';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
interface AzureBillingIntegrationGuideProps {
  setStep: Dispatch<SetStateAction<AzureBillingIntegrationStep>>;
}

const LABELS = {
  guide: {
    title: 'Azure Authorization Guide',
    description: `Please Note That:\n- The update time of Azure data is several hours.<br /><span style="color: #FF403D">After you complete the Azure authentication process, it may take up to **1 day** to see your resources in the <a href="${MAIN_PATHS.overview.pathname}">LumiTure.ai</a> platform.</span>\n- If "Billing Export" does not been showed in the side bar, please change to the account that has the permission or contact the organization. The organization account can assign the role to the account.\n- This process will only export the billing of resources linked to the corresponding billing account.`,
  },
  prerequisites: {
    title: 'Prerequisites',
    description: `**To enable and configure integration with your Azure environment, you need the following permissions:**\n1. For Azure Active Directory (Entra ID) Tenant, you need the **Application Administrator (or Global Administrator)** role.\n2. For Azure Resource Permissions (RBAC), you need the **User Access Administrator (or Owner)** role on the target Azure Subscription.\n3. For Azure Billing Management, you need the **Contributor (or Cost Management Contributor)** role on the target Azure Subscription.`,
  },
  step1: {
    title: 'Step 1. Create the Billing Export',
    description1:
      '1\\. Login to the Azure Portal. In the search bar, type **“Cost Management”** and navigate to the corresponding page.',
    description2: '2\\. In the sidebar, under **“Reporting + analytics”**, click **“Export”**. ',
    description3:
      '3\\. Click **“Scope”** and select the one for which you want to create the billing export.',
    description4: '4\\. On the Export page, click **“+ Create”** and choose **“All data”**. ',
    description5:
      '5\\. For the **“Export prefix”**, enter **“daily”**, then click **“Next >”** at the bottom of the page.',
    description6: `6\\. Fill in the destination details as follows:\n- **Storage type**: Select **“Azure Blob Storage”**.\n- **Destination and storage**: Choose **“Create new”**.\n- **Subscription**: Select the subscription from which you want to export the data.\n- **Resource group**: Click **“Create new”**, and enter **“rg-lumiture“**.\n- **Account name**:\n  - Enter a name for your new Azure Storage Account. You can name this yourself.\n  - *<span style="color: #004FB0">Make sure to copy this name, it will be used in the next step.</span>*\n- **Location**: Choose **“(US) East US“**.\n- **Container**: Enter **“billing-export”**.\n- **Directory**: Enter **“cost“**.\n- **Format**: Select **“CSV”**.\n- **Compression type**: Select **“Gzip”**.\n- **File partitioning**: Check the box.\n- **Overwrite data**: Check the box.\n- Click **“Next >”** after completing all the fields.`,
    description7: '7\\. Click **“Create”** after reviewing the entered details.',
    description8: '8\\. After the deployment is complete, you will see a page like the one below.',
  },
  step2: {
    title: 'Step 2. Authorize LumiTure.ai Service Principal in Azure',
    description1: `1\\. In the search bar, type **“Microsoft Entra ID”** and navigate to the corresponding page.\n- <span style="color: #004FB0">Copy the **“Tenant ID”**. (You will need this on the next page.)</span>`,
    description2: `2\\. In the search bar, type **“Subscriptions”** and navigate to the corresponding page.\n- <span style="color: #004FB0">Copy the **“Subscription ID”** where the billing export was created. (You will need this on the next page.)</span>`,
  },
  step3: {
    title: 'Step 3. Provide Information to LumiTure.ai',
    description1: `1\\. Return to LumiTure.ai and click the **"Go to set Azure Authorization"** button at the bottom of this page.<br />2\\. On the next page, enter the following information in the designated fields:\n- Tenant ID\n- Subscription ID\n\n3\\. After entering the information, a link will be generated.<br />4\\. Click the link and select **"Accept"** to grant Lumiture-App the required permissions.`,
  },
  buttons: {
    goToSetUsageDataAuthorization: 'Go to set Azure Authorization',
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
  ul: ({ children }: PropsWithChildren) => (
    <ul style={{ margin: 0, paddingLeft: '32px', listStyleType: 'disc' }}>{children}</ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>{children}</ol>
  ),
};

export function AzureBillingIntegrationGuide({ setStep }: AzureBillingIntegrationGuideProps) {
  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* Guide */}
        <Typography variant="h5" color="text.secondary">
          {LABELS.guide.title}
        </Typography>
        <VStack sx={{ gap: 2 }}>
          <NoteBox
            variant="info"
            content={
              <VStack>
                <Markdown
                  components={{
                    ...markdownComponentsConfig,
                    ul: ({ children }: PropsWithChildren) => (
                      <ul style={{ margin: 0, paddingLeft: '24px' }}>{children}</ul>
                    ),
                  }}
                >
                  {LABELS.guide.description}
                </Markdown>
              </VStack>
            }
          />
        </VStack>

        {/* Prerequisites */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.prerequisites.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.prerequisites.description}
          </Markdown>
        </VStack>

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
              'images/authorization/billing/azure/azure_guide_1-1.png'
            )}
            alt="guide image 1-1"
            width={1052}
            height={210}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-2.png'
            )}
            alt="guide image 1-2"
            width={1052}
            height={354}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description3}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-3.png'
            )}
            alt="guide image 1-3"
            width={1052}
            height={340}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description4}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-4.png'
            )}
            alt="guide image 1-4"
            width={1052}
            height={340}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-5.png'
            )}
            alt="guide image 1-5"
            width={1052}
            height={340}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description5}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-6.png'
            )}
            alt="guide image 1-6"
            width={1052}
            height={622}
          />
          <HStack sx={{ width: '1052px', flexWrap: 'nowrap', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Markdown components={markdownComponentsConfig}>{LABELS.step1.description6}</Markdown>
            </Box>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/billing/azure/azure_guide_1-7.png'
              )}
              alt="guide image 1-7"
              width={484}
              height={654}
            />
          </HStack>
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description7}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-8.png'
            )}
            alt="guide image 1-8"
            width={1052}
            height={372}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description8}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_1-9.png'
            )}
            alt="guide image 1-9"
            width={1052}
            height={382}
          />
        </VStack>

        <Divider />

        {/* step 2 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.step2.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description1}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_2-1.png'
            )}
            alt="guide image 2-1"
            width={1052}
            height={145}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_2-2.png'
            )}
            alt="guide image 2-2"
            width={1052}
            height={352}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_2-3.png'
            )}
            alt="guide image 2-3"
            width={1052}
            height={155}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_2-4.png'
            )}
            alt="guide image 2-4"
            width={1052}
            height={306}
          />
        </VStack>

        <Divider />

        {/* step 3 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.step3.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>{LABELS.step3.description1}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_guide_3-1.png'
            )}
            alt="guide image 3-1"
            width={1052}
            height={480}
          />
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={() => {
              setStep(AzureBillingIntegrationStep.Authentication);
            }}
          >
            {LABELS.buttons.goToSetUsageDataAuthorization}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
