'use client';

import { useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Divider, Link, Paper, Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Markdown, SingleSelect, VStack } from '@lumiture-ui';
import { getStorageImageUrl, popErrorToast, popSuccessToast } from '@shared/utils';

import { CodeClipboard } from '@components/CodeClipboard';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { ORG_SETTINGS_PATHS } from '@constants';
import {
  authorizationListQueryKey,
  AzureBillingDisplayStatus,
  useGetAuthorizationList,
  useGetAzureUsageCustomRole,
  usePostAzureUsageCheck,
} from '@hooks-api';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LABELS = {
  guide: {
    title: 'Azure Usage Data Authorization Guide',
    description: `Please Note That:\n- Please complete this step for full functionality of **Rightsizing** and **Recommendation** features.\n- <span style="color: #FF403D">After you complete the Azure authentication process, it may take up to **1 day** to see your resources in the LumiTure.ai platform.</span>`,
  },
  prerequisites: {
    title: 'Prerequisites',
    description1:
      '**Please ensure that the Azure Billing Account has already been authorized. The Billing authorization grants the LumiTure-App service principal access to your Azure tenant, which is required for usage data access.**',
    description2:
      'To create and assign roles, you must be granted the **Owner** or **User Access Administrator** IAM role on the target subscription. This is required to configure custom roles and role assignments.',
  },
  step1: {
    title: 'Step 1: Create a Custom Role Named LumiTure FinOps Reader',
    description1:
      '1\\. In the Azure portal top search bar or side menu, select **"Subscriptions"**.',
    description2: '2\\. Select the Subscription you want to integrate with LumiTure.ai.',
    description3:
      '3\\. In the left navigation menu, select **"Access control (IAM)"**. Click **“+ Add”** and select **"Add custom role"**.',
    description4: '4\\. In the Custom role editor, go to the **JSON tab** and click **"Edit"**.',
    description5:
      '5\\. Select the Azure Subscription you wish to authorize for usage data integration.',
    description6:
      '6\\. Copy the **JSON code** below. Then **paste it into the JSON editor** in the Azure portal:',
    description7:
      '7\\. Click **"Save"**, then select **"Next"** to proceed to the Review + create tab.',
    description8:
      '8\\. Review the configuration and click **"Create"** to finalize the custom role.',
  },
  step2: {
    title: 'Step 2: Assign the LumiTure FinOps Reader role to LumiTure-App',
    description1:
      '1\\. In the **Access control (IAM)** page, click **"+ Add"** and select **"Add role assignment"**.',
    description2:
      '2\\. Under the **job function role** tab, search for and select **"LumiTure FinOps Reader"**, then click **"Next"**.',
    description3:
      '3\\. In the **Members** tab, click **"+ Select members"**. Then search for the service principal **LumiTure-App**, select it from the list, and click **"Select"**.',
    description4:
      '4\\. Go to the **Review + assign** tab and click **"Review + assign"** to complete the process.',
    description5:
      '5\\. Once assigned, you can verify the **LumiTure-App** service principal under the **Role assignments** tab, listed with the **LumiTure FinOps Reader role**.',
  },
  step3: {
    title: 'Step 3. Check Authorization Status in LumiTure.ai',
    description1:
      '1\\. Return to LumiTure.ai and click the **"Go to check Usage Data Authorization"** button at the bottom of this page.',
    description2:
      "2\\. Verify your status in the Authorization List (Usage Data - Subscription).\n- Note: If the record doesn't appear, please refresh. Data sync may take up to **1 day**.",
    description3: '3\\. Once the status is Success, you are all set!',
  },
  select: {
    title: 'Azure Subscription',
    description:
      '\\* *Please **double-check** your selection, as it **generates the specific scope** for the JSON code below.*',
  },
  button: 'Go to check Usage Data Authorization',
  successMessage: 'Authorization integrated successfully.',
  errorMessage: 'Unable to integrate authorization. Please try again later.',
};

export function AzureUsageIntegration() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const hasInitializedSubscription = useRef(false);
  const { data: authorizationListData } = useGetAuthorizationList();
  const { data: azureUsageCustomRoleData, isLoading: isLoadingAzureUsageCustomRole } =
    useGetAzureUsageCustomRole(selectedSubscription);

  const azureBillingList = useMemo(
    () => authorizationListData?.data.azure.billing ?? [],
    [authorizationListData]
  );
  const azureUsageList = authorizationListData?.data.azure.usage ?? [];

  const azureProperties = azureUsageCustomRoleData?.data.properties;

  const azureUsageSubscriptionIds = azureUsageList.map((item) => item.subscriptionId);

  const azureOptions = useMemo(
    () =>
      azureBillingList
        .filter(
          (item) =>
            item.status === AzureBillingDisplayStatus.Connected &&
            !azureUsageSubscriptionIds.includes(item.subscriptionId)
        )
        .map((item) => ({
          id: item.subscriptionId,
          name: item.subscriptionName,
        })),
    [azureBillingList, azureUsageSubscriptionIds]
  );

  const markdownComponentsConfig = {
    p: ({ children }: PropsWithChildren) => (
      <Typography component="span" variant="body1">
        {children}
      </Typography>
    ),
    a: ({ children, href }: PropsWithChildren<{ href?: string }>) => (
      <Link sx={{ color: theme.palette.text.link, textDecoration: 'underline' }} href={href}>
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

  const { mutateAsync: postAzureUsageCheck, isPending: isPostAzureUsageCheckPending } =
    usePostAzureUsageCheck({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: authorizationListQueryKey });
        popSuccessToast({ description: LABELS.successMessage });
        router.push(ORG_SETTINGS_PATHS.authorizationList.pathname);
      },
      onError: () => {
        popErrorToast({ description: LABELS.errorMessage });
      },
    });

  const handleGoToCheckUsageDataAuthorization = async () => {
    if (!selectedSubscription) return;
    await postAzureUsageCheck({
      subscriptionId: selectedSubscription,
    });
  };

  useEffect(() => {
    if (azureOptions.length === 0 || hasInitializedSubscription.current) return;
    hasInitializedSubscription.current = true;
    setSelectedSubscription(azureOptions[0].id);
  }, [azureOptions]);

  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* Guide */}
        <VStack sx={{ gap: 4 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.guide.title}
          </Typography>
          <NoteBox
            variant="info"
            content={
              <VStack>
                <Markdown components={markdownComponentsConfig}>
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
          <ol style={{ margin: 0, paddingLeft: '16px' }}>
            <li style={{ color: theme.palette.error.main, fontWeight: 700 }}>
              <Markdown components={markdownComponentsConfig}>
                {LABELS.prerequisites.description1}
              </Markdown>
            </li>
            <li>
              <Markdown components={markdownComponentsConfig}>
                {LABELS.prerequisites.description2}
              </Markdown>
            </li>
          </ol>
        </VStack>
        <Divider />
        {/* Step 1 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {LABELS.step1.title}
          </Typography>
          {/* Step 1-1 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description1}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-1.png'
            )}
            alt="azure guide step 1-1"
            width={1052}
            height={225}
          />
          {/* Step 1-2 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-2.png'
            )}
            alt="azure guide step 1-2"
            width={1052}
            height={356}
          />
          {/* Step 1-3 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description3}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-3.png'
            )}
            alt="azure guide step 1-3"
            width={1052}
            height={282}
          />
          {/* Step 1-4 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description4}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-4.png'
            )}
            alt="azure guide step 1-4"
            width={1052}
            height={290}
          />
          {/* Step 1-5*/}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description5}</Markdown>
          <Paper sx={{ padding: 6, minWidth: '400px', width: 'fit-content' }}>
            <VStack alignItems="center" gap={1}>
              <Typography variant="bodyBold" color="text.secondary">
                {LABELS.select.title}
              </Typography>
              <SingleSelect
                configKey="azure-subscription"
                options={azureOptions}
                onChange={(event) => setSelectedSubscription(event.value)}
                value={selectedSubscription}
                sx={{ width: '100%' }}
              />
              <Markdown
                components={{
                  ...markdownComponentsConfig,
                  p: ({ children }: PropsWithChildren) => (
                    <Typography component="span" variant="body1" color="error.main">
                      {children}
                    </Typography>
                  ),
                }}
              >
                {LABELS.select.description}
              </Markdown>
            </VStack>
          </Paper>
          {/* Step 1-6*/}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description6}</Markdown>
          <CodeClipboard
            code={JSON.stringify({ properties: azureProperties }, null, 2)}
            isLoading={isLoadingAzureUsageCustomRole}
          />
          {/* Step 1-7 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description7}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-7.png'
            )}
            alt="azure guide step 1-7"
            width={1052}
            height={585}
          />
          {/* Step 1-8 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description8}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-8-1.png'
            )}
            alt="azure guide step 1-8-1"
            width={1052}
            height={583}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_1-8-2.png'
            )}
            alt="azure guide step 1-8-2"
            width={1052}
            height={588}
          />
        </VStack>
        <Divider />
        {/* Step 2 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {LABELS.step2.title}
          </Typography>
          {/* Step 2-1 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description1}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_2-1.png'
            )}
            alt="azure guide step 2-1"
            width={1052}
            height={282}
          />
          {/* Step 2-2 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description2}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_2-2.png'
            )}
            alt="azure guide step 2-2"
            width={1052}
            height={587}
          />
          {/* Step 2-3 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description3}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_2-3.png'
            )}
            alt="azure guide step 2-3"
            width={1052}
            height={589}
          />
          {/* Step 2-4 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description4}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_2-4.png'
            )}
            alt="azure guide step 2-4"
            width={1052}
            height={581}
          />
          {/* Step 2-5 */}
          <Markdown components={markdownComponentsConfig}>{LABELS.step2.description5}</Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/azure/azure_guide_2-5.png'
            )}
            alt="azure guide step 2-5"
            width={1052}
            height={590}
          />
        </VStack>

        <Divider />

        {/* Step 3 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {LABELS.step3.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>{LABELS.step3.description1}</Markdown>
          <Markdown components={markdownComponentsConfig}>{LABELS.step3.description2}</Markdown>
          <Markdown components={markdownComponentsConfig}>{LABELS.step3.description3}</Markdown>
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={handleGoToCheckUsageDataAuthorization}
            disabled={isPostAzureUsageCheckPending}
            isLoading={isPostAzureUsageCheckPending}
          >
            {LABELS.button}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
