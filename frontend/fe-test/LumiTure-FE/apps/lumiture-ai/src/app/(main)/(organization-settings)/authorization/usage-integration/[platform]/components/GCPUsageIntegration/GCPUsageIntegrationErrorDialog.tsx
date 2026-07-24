import type { PropsWithChildren } from 'react';

import { Typography } from '@mui/material';

import { Markdown } from '@lumiture-ui';

import InfoDialog from '@components/dialog/InfoDialog';

import { GcpUsageIntegrationErrorTypes } from '../../constants/usageIntegration';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  errorType: GcpUsageIntegrationErrorTypes | null;
}

const LABELS = {
  errorDialog: {
    [GcpUsageIntegrationErrorTypes.InsufficientPermissions]: {
      title: 'User Permission Error',
      content: `You do not have the required permissions to access resources for this Project ID in LumiTure. To resolve this, please follow these steps:<br/><br/>**Check Billing Account Status**<br/>Check Billing Account StatusConfirm that the Billing Account associated with this Scoping Project has been fully authorized.<br/><br/>**Check LumiTure Login**<br/>Confirm that you are logged into LumiTure with the correct user account that holds the necessary project access.<br/><br/>**Verify Project Permission**<br/>If the issue persists, please contact your Google Cloud Administrator to ensure your user account has the required permissions for the submitted Project ID.`,
    },
    [GcpUsageIntegrationErrorTypes.ServiceAccountPermissionDenied]: {
      title: 'Service Account Access Denied',
      content: `LumiTure.ai was not granted the **Monitoring** Viewer role for the corresponding project. To resolve this, please take one of the following actions:<br/><br/>**Grant Access**<br/>Go to the respective project's IAM/Permissions page and assign the Monitoring Viewer role to the LumiTure.ai service account.<br/><br/>**Verify Project ID**<br/>If permissions were already granted, please confirm that the Project ID entered is correct and belongs to the project where permissions were set.`,
    },
    [GcpUsageIntegrationErrorTypes.ScopingProjectAlreadyExists]: {
      title: 'Scoping Project Already Exists',
      content: 'The scoping project ID already exists. Please use a different project ID.',
    },
  },
};

export function GCPUsageIntegrationErrorDialog({ open, onClose, errorType }: ErrorDialogProps) {
  if (!errorType) {
    return null;
  }

  return (
    <InfoDialog
      open={open}
      handleClose={onClose}
      variant="error"
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
