import type { PropsWithChildren } from 'react';

import { Typography } from '@mui/material';

import { Markdown } from '@lumiture-ui';

import InfoDialog from '@components/dialog/InfoDialog';

import { AwsUsageIntegrationError } from '../../constants/usageIntegration';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  errorType: AwsUsageIntegrationError | null;
}

const LABELS = {
  errorDialog: {
    [AwsUsageIntegrationError.PolicyMismatch]: {
      title: 'IAM Policy Mismatch',
      content:
        'The StackSet deployment succeeded, but the **inline IAM Policy** does not match the permissions required by LumiTure.ai, resulting in an authorization failure.<br /><br />Verify that the inline IAM Policy created by the StackSet strictly adheres to the policy document provided in our setup documentation. A re-deployment may be required.',
    },
    [AwsUsageIntegrationError.ParameterMismatch]: {
      title: 'Invalid Configuration Parameters',
      content:
        'The AWS parameters you provided could not be mapped to a valid, existing deployment configuration within your AWS Organization.<br /><br />Please double-check the **StackSet Name** and the **Member Management Role Name** you entered, ensuring they are active and correct in your AWS Organization console.',
    },
    [AwsUsageIntegrationError.StacksetDeploymentFailed]: {
      title: 'StackSet Deployment Failed',
      content:
        'The StackSet failed to deploy to one or more target AWS accounts. This prevents LumiTure.ai from gaining necessary read access to your environment.<br /><br />Please check the **AWS Cloudformation** for the specific StackSet deployment status and detailed error logs to identify the root cause in the target account(s).',
    },
  },
};

export function AWSUsageIntegrationErrorDialog({ open, onClose, errorType }: ErrorDialogProps) {
  if (!errorType) {
    return null;
  }

  return (
    <InfoDialog
      open={open}
      handleClose={onClose}
      variant="warning"
      title={LABELS.errorDialog[errorType].title}
      content={
        <Markdown
          components={{
            p: ({ children }: PropsWithChildren) => (
              <Typography component="span" variant="body2">
                {children}
              </Typography>
            ),
          }}
        >
          {LABELS.errorDialog[errorType].content}
        </Markdown>
      }
    />
  );
}
