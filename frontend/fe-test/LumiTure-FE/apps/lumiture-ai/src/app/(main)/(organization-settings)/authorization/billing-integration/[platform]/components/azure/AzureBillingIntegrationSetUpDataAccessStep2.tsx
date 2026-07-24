import type { PropsWithChildren } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Box, Divider, Typography } from '@mui/material';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import { CopyArea } from '@components/CopyArea';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { ORG_SETTINGS_PATHS } from '@constants';
import { useGetAzureSubscriberEndpoint } from '@hooks-api';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LABELS = {
  setUpDataAccess: {
    title: 'Set Up Data Access (Storage Blob Reader & Event Subscription)',
    notes: `**A critical final step is required for full functionality.**<br /><span style="color: #FF403D">Failure to complete these steps will prevent LumiTure.ai from accessing the necessary Azure data.</span><br />Please finish the remaining steps so LumiTure.ai can securely access your Azure data and deliver valuable cloud spending insights.`,
  },
  step1: {
    title: 'Step 1: Grant LumiTure.ai Storage Blob Data Reader Permission',
    description1:
      '1\\. In the search bar, type **“Storage accounts”** and navigate to the corresponding page.',
    description2: '2\\. Click the Storage Account you created earlier.',
    description3: '3\\. Select **“Access Control (IAM)”**.',
    description4: '4\\. Click **“+Add”** and then click **“Add role assignment”**.',
    description5:
      '5\\. Search for **“Storage Blob Data Reader”**, select it from the list, then click **“Next”**.',
    description6:
      '6\\. Click **“+ Select members“** and search for the **Lumiture** service principal. Then select that **Lumiture-App** service principal and click **“Select“**.',
    description7: '7\\. Click **“Review + Assign“**.',
  },
  step2: {
    title: 'Step 2. Grant Permission for Lumiture.ai Event Subscription',
    description1:
      '1\\. In the search bar, type **“Storage accounts”** and navigate to the corresponding page.',
    description2:
      '2\\. Locate your specific storage account name (e.g., "lumiture") in the "Name" column of the resource table.',
    description3:
      '3\\. Click **“Events”** in the left-hand menu, then click **“+ Event Subscription”**.',
    description4: `4\\. Fill in the destination details as follows:\n- **Event Subscription Details**\n  - **Name**: You can assign a name of your choice.\n  - Event Schema: Remain default.\n- **Topic Details**\n  - Topic Type: Remain default.\n  - Source Resource: Remain default.\n  - **System Topic Name**: You can assign a name of your choice.\n- **Event Types**\n  - Filter to Event Types: Check **“Blob Created“**.\n- **Endpoint details**\n  - Endpoint Type: Select **“Web Hook“**.\n  - Cross-tenant delivery: Remain default.\n  - Endpoint: Click **“Configure an endpoint”** and the **“Select Web Hook”** drawer will open on the right. (Go to Next Step)`,
    description5:
      '5\\. Within the **"Select Web Hook"** drawer on the right, paste the following URL into the **“Subscriber endpoint”** field, and then click **“Confirm Selection”**.',
    description6: '6\\. Click **“Create”** at the bottom of the page to finalize the setup.',
    description7:
      '7\\. After the **Success Toast** appears and the page redirects to the **Events** screen, please return to LumiTure.ai.',
    description8: `8\\. Please **return to LumiTure.ai** and click the button **“Check Authorization Status”** at the bottom of the current page to refresh your authorization list.\n- If the status shows **Connected**, this confirms successful authorization, and you may now begin using your Azure data within LumiTure.ai.\n- If the status shows **In Progress**, please wait a few moments for data synchronization to complete.\n- If the status shows **Error**, please click on the resource to re-enter this setup page. Ensure all prerequisites and configurations are correctly set, or contact a technical representative for assistance.`,
  },
  buttons: {
    checkAuthorizationStatus: 'Check Authorization Status',
  },
  copySuccessMessage: 'Copied successfully.',
};

const markdownComponentsConfig = {
  p: ({ children }: PropsWithChildren) => (
    <Typography component="span" variant="body1">
      {children}
    </Typography>
  ),
  ul: ({ children }: PropsWithChildren) => (
    <ul style={{ margin: 0, paddingLeft: '32px' }}>{children}</ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol style={{ margin: 0, paddingLeft: '20px' }}>{children}</ol>
  ),
};

export function AzureBillingIntegrationSetUpDataAccessStep2() {
  const router = useRouter();

  const { data: subscriberEndpointData, isLoading: isLoadingSubscriberEndpoint } =
    useGetAzureSubscriberEndpoint();
  const subscriberEndpointUrl = subscriberEndpointData?.data.url || '';

  const handleCheckAuthorizationStatus = () => {
    router.push(ORG_SETTINGS_PATHS.authorizationList.pathname);
  };

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
              'images/authorization/billing/azure/azure_set_up_access_step2_1-1.png'
            )}
            alt="set up data access step2 image 1-1"
            width={1052}
            height={180}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_1-2.png'
            )}
            alt="set up data access step2 image 1-2"
            width={1052}
            height={291}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description3}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_1-3.png'
            )}
            alt="set up data access step2 image 1-3"
            width={1052}
            height={258}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description4}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_1-4.png'
            )}
            alt="set up data access step2 image 1-4"
            width={1052}
            height={164}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description5}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_1-5.png'
            )}
            alt="set up data access step2 image 1-5"
            width={1052}
            height={358}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description6}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_1-6.png'
            )}
            alt="set up data access step2 image 1-6"
            width={1052}
            height={500}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description7}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_1-7.png'
            )}
            alt="set up data access step2 image 1-7"
            width={1052}
            height={338}
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
              'images/authorization/billing/azure/azure_set_up_access_step2_2-1.png'
            )}
            alt="set up data access step2 image 2-1"
            width={1052}
            height={168}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_2-2.png'
            )}
            alt="set up data access step2 image 2-2"
            width={1052}
            height={288}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description3}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_2-3.png'
            )}
            alt="set up data access step2 image 2-3"
            width={1052}
            height={332}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_2-4.png'
            )}
            alt="set up data access step2 image 2-4"
            width={1052}
            height={198}
          />
          <HStack sx={{ gap: 2, width: '1052px', flexWrap: 'nowrap' }}>
            <Box sx={{ flex: 1 }}>
              <Markdown components={markdownComponentsConfig}>{LABELS.step2.description4}</Markdown>
            </Box>
            <Image
              src={getStorageImageUrl(
                bucketName,
                'images/authorization/billing/azure/azure_set_up_access_step2_2-5.png'
              )}
              alt="set up data access step2 image 2-5"
              width={526}
              height={776}
            />
          </HStack>
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description5}</Markdown>
          <CopyArea value={subscriberEndpointUrl} isLoading={isLoadingSubscriberEndpoint} />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_2-6.png'
            )}
            alt="set up data access step2 image 2-6"
            width={1052}
            height={302}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description6}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_2-7-1.png'
            )}
            alt="set up data access step2 image 2-7"
            width={1052}
            height={672}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description7}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/billing/azure/azure_set_up_access_step2_2-8.png'
            )}
            alt="set up data access step2 image 2-8"
            width={1052}
            height={728}
          />
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description8}</Markdown>
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={handleCheckAuthorizationStatus}
          >
            {LABELS.buttons.checkAuthorizationStatus}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
