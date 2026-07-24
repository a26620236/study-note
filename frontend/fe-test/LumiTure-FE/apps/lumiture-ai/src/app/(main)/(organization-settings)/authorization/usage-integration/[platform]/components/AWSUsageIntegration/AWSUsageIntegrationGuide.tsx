import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import Image from 'next/image';

import { Box, Divider, Link, Typography, useTheme } from '@mui/material';

import { Button, HStack, Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import { CodeClipboard } from '@components/CodeClipboard';
import { CopyArea } from '@components/CopyArea';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import NoteBox from '@components/NoteBox';
import { useGetAwsExternalId } from '@hooks-api';

import { AwsUsageIntegrationSteps } from '../../constants/usageIntegration';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LUMITURE_AMAZON_S3_URL =
  'https://lumiture-stackset-template.s3.us-east-1.amazonaws.com/member_role_template.yaml';

const DEPLOY_STACK_SET_COMMAND = `aws cloudformation create-stack-instances \
  --stack-set-name LumiTureAccountMemberMonitoringSet \
  --deployment-targets OrganizationalUnitIds=<OU id> \
  --regions '<region>'`;

const LABELS = {
  sections: {
    guide: {
      title: 'AWS Usage Data Authorization Guide',
      description: `Please Note That:\n- The update time of AWS account data is several hours. After you complete the AWS authentication process, it may take up to 1 day to see your resources in the LumiTure.ai platform.\n - <span style="color: #FF403D">Each AWS account is limited to a maximum of **5 Cost and Usage Report 2.0 (CUR 2.0) configurations.**</span> Please verify that your AWS management account has not reached this limit before proceeding with the integration.\n- It can take up to 24 hours for AWS to start delivering exports to your Amazon S3 bucket. Once delivery starts, AWS refreshes the export output in your S3 bucket at least once a day. The actual refresh rate may be different due to various factors. Therefore, the data displayed and accessible on the console is from one day prior, rather than in real-time.`,
    },
    prerequisites: {
      title: 'Prerequisites',
      description1:
        '**Please confirm that the Management Account has been authorized for Billing Data.**',
      description2:
        'Ensure you have administrative access to your **Organization Management Account**.',
      description3: `For users who have AWS CLI SDK, please refer to <a href="#method-a">Method A: Create with AWS CLI commend.</a><br />For users who don't have AWS CLI SDK, please refer to <a href="#method-b">Method B: Create with console.</a>`,
    },
    methodA: {
      title: 'Method A: Create with AWS CLI commend',
      step1: {
        title: 'Step 1. Create Role and Policy for Management with AWS CLI commend',
        description1: '1\\. Login to the your AWS Management Account Console.',
        description2: '2\\. Navigate to **“CloudShell”**.',
        description3:
          '3\\. Paste the necessary permission policies provided by LumiTure.ai into the text box.<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You may see the hint window when you try to paste it, click **“Paste“**.<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Execute the auto-generated commend by pressing **“Enter“** key on your keyboard.',
      },
      step2: {
        title: 'Step 2. Create Role and Policy for Across Member Accounts',
        description1: '1\\. Navigate to **“CloudShell”**.',
        description2:
          '2\\. Paste the necessary permission policies provided by LumiTure.ai into the text box.<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You may see the hint window when you try to paste it, click **“Paste“** and create the StackSet.',
        description3:
          '3\\. Execute the auto-generated commend by pressing **“Enter“** key on your keyboard.',
        description4: '4\\. On the same shell, deploy the StackSet below:',
      },
      step3: {
        title: 'Step 3. Provide Information to LumiTure.ai',
        description:
          '1\\. Return to LumiTure.ai and click the **"Go to set Usage Data Authorization"** button at the bottom of this page.<br />2\\. On the next page, enter the following information in the designated fields:\n - StackSet Name\n - Member Management Role Name\n - AWS Management Account ID\n - External ID',
      },
    },
    methodB: {
      title: 'Method B: Create with Console',
      step1: {
        title: 'Step 1. Create Role and Policy for Management',
        description1: '1\\. Login to the your AWS Management Account Console.',
        description2:
          '2\\. Search **“CloudFormation”** from the top search bar, move your cursor to **“CloudFormation“** and click **“StackSets“** in the Top features list.',
        description3: '3\\. Click the **“Create stack set”** button on the top right.',
        description4:
          '4\\. Select the option or fill in the information according to the guidance below:\n - **Permissions - Permission model:** Select **“Service_managed permissions”**\n - **Prerequisite - Prepare template:** Select **“Template is ready”**\n - **Specify template:** Select **“Amazon S3 URL”**.\n    - Then, **copy** the URL provided below, **paste** it into the “Amazon S3 URL” field, and click **“Next”** on the bottom right.',
        description5:
          '5\\. Fill in the information needed as below:\n - **StackSet name:** LumiTureAccountMemberMonitoringSet (You will need this on the next page.)\n    - **Parameters**\n        - **ExternalId:** xdRppjI5oI7a (You will need this on the next page.)\n        - **RoleName:** LumiTureAccountMemberMonitoringRole (You will need this on the next page.)\n        - **ThirdPartyPrincipalArn:** arn:aws:iam::536697256548:root\n - Then click **“Next“** on the bottom right.',
        description6:
          '6\\. You will see the **Configure stack set options** page, scroll down to the bottom, check **“I acknowledge that AWS CloudFormation may create IAM resources with custom names“** and click **“Next“**.',
        description7:
          '7\\. You will see the **Set deployment options** page. In **Deployment targets** block, select **“Deploy to organizational units (OUs)“**, then provide the **AWS Organization Unit ID (OU ID)**.',
        description8:
          '8\\. In **Specify Regions** block, select your **home region**, usually default as “US East (N.Virginia) us-east-1“.',
        description9: '9\\. Scroll down to the bottom and click **“Next“**.',
        description10:
          '10\\. You will see the **Review and create** page. Review all the information and scroll down to click **“Submit“**. It may take a moment to complete.',
      },
      step2: {
        title: 'Step 2. Provide Information to LumiTure.ai',
        description:
          '1\\. Return to LumiTure.ai and click the **"Go to set Usage Data Authorization"** button at the bottom of this page.<br />2\\. On the next page, enter the following information in the designated fields:\n - StackSet Name\n - Member Management Role Name\n - AWS Management Account ID\n - External ID',
      },
    },
    copyCode: {
      getPermissionPolicy: (externalId: string) =>
        `aws cloudformation create-stack \\\n  --stack-name LumiTureManagementStack \\\n  --template-body <path to template> \\\n  --parameters ParameterKey=ExternalId,ParameterValue="${externalId}" \\\n  --capabilities CAPABILITY_NAMED_IAM`,
      getRoleAndPolicyForMemberAccounts: (externalId: string) =>
        `aws cloudformation create-stack-set \\\n  --stack-set-name LumiTureAccountMemberMonitoringSet \\\n  --template-body <file path url LT provide> \\\n  --permission-model SERVICE_MANAGED \\\n  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=true \\\n  --capabilities CAPABILITY_NAMED_IAM \\\n  --region us-east-1 \\\n  --parameters \\\n  ParameterKey=ExternalId,ParameterValue="${externalId}"`,
    },
  },
  button: {
    goToSetUsageDataAuthorization: 'Go to set Usage Data Authorization',
  },
};

interface AWSUsageIntegrationGuideProps {
  setStep: Dispatch<SetStateAction<AwsUsageIntegrationSteps>>;
}

export function AWSUsageIntegrationGuide({ setStep }: AWSUsageIntegrationGuideProps) {
  const theme = useTheme();

  const { data: awsExternalIdData, isLoading: isLoadingAwsExternalId } = useGetAwsExternalId();
  const externalId = awsExternalIdData?.data.externalId || '';

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

  return (
    <>
      <VStack sx={{ gap: 4 }}>
        {/* Guide */}
        <VStack sx={{ gap: 4 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.guide.title}
          </Typography>
          <NoteBox
            variant="info"
            content={
              <VStack>
                <Markdown components={markdownComponentsConfig}>
                  {LABELS.sections.guide.description}
                </Markdown>
              </VStack>
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

        <Divider />

        {/* Method A Step 1 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary" id="method-a">
            {LABELS.sections.methodA.title}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.methodA.step1.title}
          </Typography>
          <VStack>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodA.step1.description1}
            </Markdown>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodA.step1.description2}
            </Markdown>
          </VStack>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_a_1-1.png'
            )}
            alt="Create Role and Policy for Management with AWS CLI commend"
            width={1052}
            height={228}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodA.step1.description3}
          </Markdown>
          <Box sx={{ width: '1052px' }}>
            <CodeClipboard
              code={LABELS.sections.copyCode.getPermissionPolicy(externalId)}
              plainText
              isLoading={isLoadingAwsExternalId}
            />
          </Box>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_a_1-2.png'
            )}
            alt="Create Role and Policy for Management with AWS CLI commend"
            width={1052}
            height={516}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_a_1-3.png'
            )}
            alt="Create Role and Policy for Management with AWS CLI commend"
            width={1052}
            height={334}
          />
        </VStack>

        <Divider />

        {/* Method A Step 2 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.methodA.step2.title}
          </Typography>
          <VStack>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodA.step2.description1}
            </Markdown>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodA.step2.description2}
            </Markdown>
          </VStack>
          <Box sx={{ width: '1052px' }}>
            <CodeClipboard
              code={LABELS.sections.copyCode.getRoleAndPolicyForMemberAccounts(externalId)}
              plainText
              isLoading={isLoadingAwsExternalId}
            />
          </Box>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodA.step2.description3}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_a_2-1.png'
            )}
            alt="Create Role and Policy for Across Member Accounts"
            width={1052}
            height={336}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodA.step2.description4}
          </Markdown>
          <Box sx={{ width: '1052px' }}>
            <CodeClipboard code={DEPLOY_STACK_SET_COMMAND} plainText />
          </Box>
        </VStack>

        <Divider />

        {/* Method A Step 3 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.methodA.step3.title}
          </Typography>
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodA.step3.description}
          </Markdown>
        </VStack>

        <Divider />

        {/* Method B Step 1 */}
        <VStack sx={{ gap: 2 }}>
          <Typography variant="h5" color="text.secondary" id="method-b">
            {LABELS.sections.methodB.title}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.methodB.step1.title}
          </Typography>
          <VStack>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodB.step1.description1}
            </Markdown>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodB.step1.description2}
            </Markdown>
          </VStack>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-1.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={252}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodB.step1.description3}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-2.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={320}
          />
          <VStack>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodB.step1.description4}
            </Markdown>
          </VStack>
          <CopyArea value={LUMITURE_AMAZON_S3_URL} />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-3.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={740}
          />
          <VStack>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodB.step1.description5}
            </Markdown>
          </VStack>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-4.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={716}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodB.step1.description6}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-5.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={674}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodB.step1.description7}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-6.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={542}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodB.step1.description8}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-7.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={516}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodB.step1.description9}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-8.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={526}
          />
          <Markdown components={markdownComponentsConfig}>
            {LABELS.sections.methodB.step1.description10}
          </Markdown>
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-9.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={304}
          />
          <Image
            src={getStorageImageUrl(
              bucketName,
              'images/authorization/usage/aws/aws_guide_method_b_1-10.png'
            )}
            alt="Create Role and Policy for Management with Console"
            width={1052}
            height={530}
          />
        </VStack>

        <Divider />

        {/* Method B Step 2 */}
        <VStack sx={{ gap: 2, pb: 8 }}>
          <Typography variant="h5" color="text.secondary">
            {LABELS.sections.methodB.step2.title}
          </Typography>
          <VStack>
            <Markdown components={markdownComponentsConfig}>
              {LABELS.sections.methodB.step2.description}
            </Markdown>
          </VStack>
        </VStack>
      </VStack>
      <FixedBottomBarWrapper>
        <HStack sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            sx={{ bgcolor: 'primary.main', color: 'white' }}
            onClick={() => {
              setStep(AwsUsageIntegrationSteps.AUTHENTICATION);
            }}
          >
            {LABELS.button.goToSetUsageDataAuthorization}
          </Button>
        </HStack>
      </FixedBottomBarWrapper>
    </>
  );
}
