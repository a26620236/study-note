import type { PropsWithChildren } from 'react';
import Image from 'next/image';

import { Box, Divider, Link, Typography } from '@mui/material';

import { Icon, Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import { GCP_SERVICE_ACCOUNT } from '@app/(main)/(organization-settings)/authorization/billing-integration/[platform]/components/constants';
import { CopyArea } from '@components/CopyArea';
import NoteBox from '@components/NoteBox';
import { MAIN_PATHS, NodeEnvName } from '@constants';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const getImageUrl = (imagePath: string) => getStorageImageUrl(bucketName, imagePath);

const LABELS = {
  guide: {
    title: 'GCP Authorization Guide',
    description: `Please Note That:\n- The update time of GCP data is several hours.<br /><span style="color: #FF403D">After you complete the GCP authentication process, it may take up to **1 day** to see your resources in the <a href="${MAIN_PATHS.overview.pathname}">LumiTure.ai</a> platform.</span>\n- If "Billing Export" does not been showed in the side bar, please change to the account that has the permission or contact the organization. The organization account can assign the role to the account.\n- This process will only export the billing of resources linked to the corresponding billing account.`,
  },
  prerequisites: {
    title: 'Prerequisites: Permissions Check',
    description: `**To enable and configure the export of Google Cloud billing usage cost to BigQuery dataset, you need the following permissions:**`,
    permissions: `1. For Cloud Billing management, you need the **Billing Account Administrator** role on the target Cloud Billing account.\n2. For BigQuery, you need the **BigQuery Data Owner** role on the project.\n3. For the project containing the target dataset, you need the **Editor** role.`,
    info: 'If you are unsure how to check, simply proceed with the steps below.',
  },
  step1: {
    title: 'Step 1: Create or Choose Project for Export Billing Data',
    description1: '1\\. Please ensure that you can see the **Billing** page on the sidebar',
    description2: '2\\. Go to **Cloud overview** → Click **"Dashboard".**',
    description3:
      '3\\. Click on the **"PROJECT NAME"** button on the top of the page to create or choose the project that you would like to create the dataset in.',
    description4: '4\\. If you want to create a new project, click **"NEW PROJECT"** on the top.',
    description5:
      '5\\. While creating a project, please make sure this project is under the billing account that you would like to link with LumiTure.ai .',
  },
  step2: {
    title: 'Step 2: Enable the BigQuery Data Transfer Service API',
    description1:
      '1\\. Make sure the 2 APIs are enabled. If not, click on the **"ENABLE"** button to enable it.',
    link1: {
      text: 'BigQuery API',
      url: 'https://console.cloud.google.com/marketplace/product/google/bigquery.googleapis.com',
    },
    link2: {
      text: 'BigQuery Data Transfer Service API',
      url: 'https://console.cloud.google.com/marketplace/product/google/bigquery.googleapis.com',
    },
  },
  step3: {
    title: 'Step 3: Create a BigQuery dataset',
    description1:
      '1\\. Go to BigQuery page from the sidebar. Under **Explorer**, find the project you created for LumiTure.ai and click on **Vertical Ellipsis button** and **"Create dataset"**.',
    description2:
      '2\\. Create the dataset named **"lumiture_billing_data"**. Make sure the dataset location is in **multi-region locations (US)**. The billing data will be stored in the dataset. Click **"CREATE dataset"**.',
  },
  step4: {
    title: 'Step 4: Manage Permissions - Dataset',
    description1:
      '1\\. Find the dataset created for LumiTure.ai under your project, click on **Vertical Ellipsis button** and click on **"Share"** → **"Manage Permissions"**.',
    description2: '2\\. Click on **"ADD PRINCIPAL"** on the top.',
    description3: '3\\. Copy the service account below:',
    description4:
      '4\\. Paste it in the **New principals** blank, and assign **"BigQuery Data Viewer"** role. Click **"SAVE"**.',
  },
  step5: {
    title: 'Step 5. Provide Information to LumiTure.ai',
    description1:
      '1\\. Go to **Billing** page from the sidebar.<br />If you have multiple accounts, choose **"Go to linked billing account"** if you have multiple accounts first.',
    description2:
      '2\\. Make sure the billing account displayed on the left is the billing account you would like to integrate to LumiTure.ai . Click on the **"Manage billing account"** button.',
    description3: '3\\. Click on **"Add principal"** in the top right corner.',
    description4: '4\\. Copy the service account below:',
    description5:
      '5\\. Paste it in the **New principals** blank, and assign the **"Billing Account Viewer"** role. Click **"SAVE"**.',
  },
  step6: {
    title: 'Step 6: Enable Data Export',
    description1:
      '1\\. Go to the [Billing export page](https://console.cloud.google.com/billing/export).',
    description2: '2\\. Check if **Detailed usage cost** is **enabled**.',
    description3:
      '3\\. If it\'s disabled, click **"Edit settings"**, choose the Projects and Dataset for LumiTure.ai , click **"Save"**.',
    description4: '4\\. Check if **Pricing** is **enabled**.',
    description5:
      '5\\. If it\'s disabled, click **"Edit settings"**, choose the Projects and Dataset for LumiTure.ai , click **"Save"**.',
    description6: `6\\. Please ensure that after completing the two settings\n- Both **Detailed usage cost** and **Pricing** are set to **"Enabled"**.\n- **Copy the information** in the highlighted box. *<span style="color: #004FB0">(it will be used in the next step)</span>*`,
  },
  step7: {
    title: 'Step 7: Provide Information to LumiTure.ai',
    description1:
      '1\\. Return to LumiTure.ai and click the **"Go to set Google Authorization"** button at the bottom of this page.',
    description2: `2\\. On the next page, enter the following information in the designated fields:\n- Billing Account ID\n- Detailed Usage Cost\n  - Project ID\n  - Dataset Name\n- Pricing\n  - Project ID\n  - Dataset Name`,
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
    <ul style={{ margin: 0, paddingLeft: '32px', listStyleType: 'disc', fontSize: '0.7em' }}>
      {children}
    </ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
  ),
  li: ({ children }: PropsWithChildren) => <li style={{ fontSize: '14px' }}>{children}</li>,
};

export function GCPBillingGuide() {
  const serviceAccount =
    GCP_SERVICE_ACCOUNT[process.env.NEXT_PUBLIC_NODE_ENV_NAME ?? NodeEnvName.Prod];

  return (
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
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '24px',
                        listStyleType: 'disc',
                        fontSize: '0.7em',
                      }}
                    >
                      {children}
                    </ul>
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
        <Markdown components={markdownComponentsConfig}>
          {LABELS.prerequisites.permissions}
        </Markdown>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <Icon name="info" sx={{ fontSize: 16 }} />
          <Typography variant="captionBold">{LABELS.prerequisites.info}</Typography>
        </Box>
      </VStack>

      <Divider />

      {/* Step 1 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step1.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description1}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_1-1.png')}
          alt="Screenshot showing the Billing page in the sidebar"
          width={1052}
          height={468}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description2}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_1-2.png')}
          alt="Screenshot showing the Dashboard button in the sidebar"
          width={1052}
          height={469}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description3}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_1-3.png')}
          alt="Screenshot showing the 'PROJECT NAME' button at the top of the GCP Console"
          width={1052}
          height={119}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description4}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_1-4.png')}
          alt="Screenshot showing the 'NEW PROJECT' button in change project dialog"
          width={1052}
          height={515}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description5}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_1-5.png')}
          alt="Screenshot showing how to select a billing account when creating a project in GCP Console"
          width={1052}
          height={401}
        />
      </VStack>

      <Divider />

      {/* Step 2 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step2.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description1}</Markdown>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <VStack sx={{ alignItems: 'center', gap: 2 }}>
            <Image
              src={getImageUrl('images/authorization/billing/gcp/google_guide_2-1_1.png')}
              alt="Screenshot showing BigQuery API with enabled status"
              width={522}
              height={200}
            />
            <Typography
              component="a"
              href={LABELS.step2.link1.url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary.light"
            >
              {LABELS.step2.link1.text}
            </Typography>
          </VStack>
          <VStack sx={{ alignItems: 'center', gap: 2 }}>
            <Image
              src={getImageUrl('images/authorization/billing/gcp/google_guide_2-1_2.png')}
              alt="Screenshot showing the 'ENABLE' button for BigQuery Data Transfer Service API"
              width={523}
              height={200}
            />
            <Typography
              component="a"
              href={LABELS.step2.link2.url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary.light"
            >
              {LABELS.step2.link2.text}
            </Typography>
          </VStack>
        </Box>
      </VStack>

      <Divider />

      {/* Step 3 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step3.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step3.description1}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_3-1.png')}
          alt="Screenshot showing how to create a dataset in BigQuery via the vertical ellipsis menu"
          width={1052}
          height={338}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step3.description2}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_3-2.png')}
          alt="Screenshot showing BigQuery dataset creation screen with name and location settings"
          width={1052}
          height={511}
        />
      </VStack>

      <Divider />

      {/* Step 4 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step4.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step4.description1}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_4-1.png')}
          alt="Screenshot showing BigQuery dataset for LumiTure.ai with vertical ellipsis button clicked and 'Share' → 'Manage Permissions' selected"
          width={1052}
          height={351}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step4.description2}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_4-2.png')}
          alt="Screenshot showing 'ADD PRINCIPAL' button clicked in the BigQuery dataset permissions drawer"
          width={1052}
          height={314}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step4.description3}</Markdown>
        <CopyArea value={serviceAccount} />
        <Markdown components={markdownComponentsConfig}>{LABELS.step4.description4}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_4-4.png')}
          alt="Screenshot showing 'New principals' field with service account pasted and 'BigQuery Data Viewer' role selected from the dropdown"
          width={1052}
          height={510}
        />
      </VStack>

      <Divider />

      {/* Step 5 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step5.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step5.description1}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_5-1.png')}
          alt="Screenshot showing Billing page with multiple billing accounts and 'Go to linked billing account' button highlighted"
          width={1052}
          height={243}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step5.description2}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_5-2.png')}
          alt="Screenshot showing 'Manage billing account' button highlighted on the billing account page"
          width={1052}
          height={137}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step5.description3}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_5-3.png')}
          alt="Screenshot showing 'Add principal' button highlighted in the top right corner of the billing account page"
          width={1052}
          height={246}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step5.description4}</Markdown>
        <CopyArea value={serviceAccount} />
        <Markdown components={markdownComponentsConfig}>{LABELS.step5.description5}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_5-5.png')}
          alt="Screenshot showing 'New principals' field with service account pasted and 'BigQuery Data Viewer' role selected from the dropdown"
          width={1052}
          height={509}
        />
      </VStack>

      <Divider />

      {/* Step 6 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step6.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step6.description1}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step6.description2}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_6-2.png')}
          alt="Screenshot showing 'Detailed usage cost' disabled and 'Edit settings' button highlighted"
          width={1052}
          height={508}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step6.description3}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_6-3.png')}
          alt="Screenshot showing 'Projects' dropdown and 'Dataset' field highlighted"
          width={1052}
          height={295}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step6.description4}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_6-4.png')}
          alt="Screenshot showing 'Pricing' disabled and 'Edit settings' button highlighted"
          width={1052}
          height={508}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step6.description5}</Markdown>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_6-5.png')}
          alt="Screenshot showing 'Edit settings' with 'Projects' dropdown and 'Dataset' field highlighted"
          width={1052}
          height={347}
        />
        <Box>
          <Markdown components={markdownComponentsConfig}>{LABELS.step6.description6}</Markdown>
        </Box>
        <Image
          src={getImageUrl('images/authorization/billing/gcp/google_guide_6-6.png')}
          alt="Screenshot showing 'Detailed usage cost' and 'Pricing' both enabled"
          width={1052}
          height={523}
        />
      </VStack>

      <Divider />

      {/* Step 7 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step7.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step7.description1}</Markdown>
        <Box>
          <Markdown components={markdownComponentsConfig}>{LABELS.step7.description2}</Markdown>
        </Box>
      </VStack>
    </VStack>
  );
}
