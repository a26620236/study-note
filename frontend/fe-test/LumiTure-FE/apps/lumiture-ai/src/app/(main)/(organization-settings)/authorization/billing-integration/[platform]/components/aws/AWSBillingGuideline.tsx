import type { PropsWithChildren } from 'react';
import Image from 'next/image';

import { Box, Divider, Link, Stack, Typography } from '@mui/material';

import { Markdown, VStack } from '@lumiture-ui';
import { getStorageImageUrl } from '@shared/utils';

import { CodeClipboard } from '@components/CodeClipboard';
import { CopyArea } from '@components/CopyArea';
import NoteBox from '@components/NoteBox';
import { useGetAwsExternalId } from '@hooks-api';

const bucketName = process.env.NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME ?? '';
const LUMITURE_AWS_ACCOUNT_ID = '536697256548';

const LABELS = {
  guide: {
    title: 'AWS Authorization Guide',
    description:
      '- The update time of AWS data is several hours. After you complete the AWS authentication process, it may take up to 1 day to see your resources in the LumiTure.ai platform.\n- <span style="color: #FF403D">Each AWS account is limited to **5 CUR 2.0 and 2 FOCUS data exports**. Please verify that your management account has not reached these specific limits before proceeding with the integration.</span>\n- It can take up to 24 hours for AWS to start delivering exports to your Amazon S3 bucket. Once delivery starts, AWS refreshes the export output in your S3 bucket at least once a day. The actual refresh rate may be different due to various factors. Therefore, the data displayed and accessible on the console is from one day prior, rather than in real-time.',
  },
  prerequisites: {
    title: 'Prerequisites',
    description:
      '- **Ensure you have administrative access to your Organization Management Account**.',
  },
  step1: {
    title: 'Step 1. Create AWS IAM Policy',
    description1: '1\\. Login to the your AWS Management Account Console.',
    description2: '2\\. Navigate to the IAM service.',
    description3: '3\\. In the left sidebar, click on "Policies".',
    description4: '4\\. Click the "Create policy" button.',
    description5: '5\\. Select the JSON tab.',
    description6:
      '6\\. Paste the necessary permission policies provided by LumiTure.ai into the text box.',
    description6Note: 'Please replace ***{YOUR_ACCOUNT_ID}*** with your management account ID.',
    imageAlt: 'AWS Permission Setup Guide',
    description7: '7\\. Review and create the policy with a descriptive name ',
    description7Example:
      '<span style="color: #B3B3B3">(e.g., "**LumiTureIntegrationPolicy**").</span>',
    description7Note:
      '<span style="color: #004FB0">*It may take several minutes to complete the policy. Please stay on the page and wait until the process finishes.*</span>',
  },
  step2: {
    title: 'Step 2. Create AWS IAM Role',
    description1: '1\\. In the IAM console, click on "**Roles**" in the left sidebar.',
    description2: '2\\. Click the "**Create role**" button.',
    description3: '3\\. For trusted entity type, select "AWS account".',
    description4: '4\\. Choose "**Another AWS account**" and enter **LumiTure\'s AWS Account ID**.',
    description5:
      '5\\. Check the box for "**Require external ID**" and enter the **External ID** generated earlier.',
    description6: '6\\. Ensure "Require MFA" is left **<u>unchecked</u>**.',
    imageAlt: 'AWS Role Setup Guide',
    description7: '7\\. On the next page, attach the policy you created in the previous step.',
    description8: '8\\. Review and create the role with a descriptive name ',
    description8Example:
      '<span style="color: #B3B3B3">(e.g., "**LumiTureIntegrationPolicy**").</span>',
    copyLabels: {
      accountId: "LumiTure's AWS Account ID",
      externalId: 'External ID',
    },
  },
  step3: {
    title: 'Step 3. Provide Information to LumiTure.ai',
    description1: '1\\. After creating the role, copy the **IAM Role Name**.',
    description2:
      '2\\. Return to your LumiTure.ai account and click the "**Go to set AWS Authorization**" button at the bottom of the page.',
    description3:
      '3\\. On the next page, enter the following information in the designated fields:',
    fields: ['AWS Management Account ID', 'IAM Role Name', 'IAM Policy Name', 'External ID'],
  },
};

const POLICY = `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetBucketLocation",
                "s3:ListBucket",
                "s3:GetObject",
                "s3:CreateBucket",
                "s3:PutBucketPolicy",
                "s3:PutBucketNotification",
                "s3:GetBucketNotification"
            ],
            "Resource": [
                "arn:aws:s3:::lumiture-{ACCOUNT ID}-cur",
                "arn:aws:s3:::lumiture-{ACCOUNT ID}-focus"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "bcm-data-exports:CreateExport",
                "bcm-data-exports:ListExports",
                "bcm-data-exports:GetExport",
                "bcm-data-exports:DeleteExport",
                "bcm-data-exports:UpdateExport",
                "cur:PutReportDefinition",
                "cur:DeleteReportDefinition",
                "cur:ModifyReportDefinition",
                "cur:DescribeReportDefinitions"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "organizations:ListAccounts",
                "iam:ListAttachedRolePolicies",
                "iam:GetPolicy",
                "iam:GetPolicyVersion",
                "iam:ListAccountAliases",
                "account:GetAccountInformation"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:DescribeStackInstance",
                "cloudformation:DescribeStackSet",
                "cloudformation:DescribeStacks",
                "cloudformation:ListStackInstances",
                "cloudformation:ListStackSets",
                "cloudformation:ListStacks",
                "cloudformation:UpdateStackSet",
                "cloudwatch:Describe*",
                "cloudwatch:Get*",
                "cloudwatch:List*",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceStatus"
            ],
            "Resource": "*"
        }
    ]
}
`;

export default function AWSBillingGuideline() {
  const { data: awsExternalIdData, isLoading: isLoadingAwsExternalId } = useGetAwsExternalId();
  const externalId = awsExternalIdData?.data.externalId || '';

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
              <Markdown components={markdownComponentsConfig}>{LABELS.guide.description}</Markdown>
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

      {/* Step 1 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step1.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description1}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description2}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description3}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description4}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step1.description5}</Markdown>
        <Stack>
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description6}</Markdown>
          <ul style={{ margin: 0 }}>
            <li>
              <Markdown components={markdownComponentsConfig}>
                {LABELS.step1.description6Note}
              </Markdown>
            </li>
          </ul>
        </Stack>
        <Image
          src={getStorageImageUrl(
            bucketName,
            'images/authorization/billing/aws/aws_guide_permission.png'
          )}
          alt={LABELS.step1.imageAlt}
          width={1052}
          height={543}
        />
        <Stack>
          <Markdown components={markdownComponentsConfig}>
            {`${LABELS.step1.description7}${LABELS.step1.description7Example}`}
          </Markdown>
          <Markdown components={markdownComponentsConfig}>{LABELS.step1.description7Note}</Markdown>
        </Stack>
        <Box sx={{ width: '1052px' }}>
          <CodeClipboard code={POLICY} isLoading={isLoadingAwsExternalId} />
        </Box>
      </VStack>

      <Divider />

      {/* Step 2 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step2.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description1}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description2}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description3}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description4}</Markdown>
        <CopyArea label={LABELS.step2.copyLabels.accountId} value={LUMITURE_AWS_ACCOUNT_ID} />
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description5}</Markdown>
        <CopyArea
          label={LABELS.step2.copyLabels.externalId}
          value={externalId}
          isLoading={isLoadingAwsExternalId}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description6}</Markdown>
        <Image
          src={getStorageImageUrl(
            bucketName,
            'images/authorization/billing/aws/aws_guide_role_assignment.png'
          )}
          alt={LABELS.step2.imageAlt}
          width={1052}
          height={674}
        />
        <Markdown components={markdownComponentsConfig}>{LABELS.step2.description7}</Markdown>
        <Markdown components={markdownComponentsConfig}>
          {`${LABELS.step2.description8}${LABELS.step2.description8Example}`}
        </Markdown>
      </VStack>

      <Divider />

      {/* Step 3 */}
      <VStack sx={{ gap: 2 }}>
        <Typography variant="h5" color="text.secondary">
          {LABELS.step3.title}
        </Typography>
        <Markdown components={markdownComponentsConfig}>{LABELS.step3.description1}</Markdown>
        <Markdown components={markdownComponentsConfig}>{LABELS.step3.description2}</Markdown>
        <Stack>
          <Markdown components={markdownComponentsConfig}>{LABELS.step3.description3}</Markdown>
          <ul style={{ margin: 0 }}>
            {LABELS.step3.fields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </Stack>
      </VStack>
    </VStack>
  );
}
