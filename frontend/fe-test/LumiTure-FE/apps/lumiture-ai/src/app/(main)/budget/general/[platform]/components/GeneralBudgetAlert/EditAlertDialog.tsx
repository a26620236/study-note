import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash-es';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { usePostGeneralAlerts, type GeneralAlertsPayload } from '@hooks-api';

import { defaultValues as formDefaultValues } from '../../constants/generalAlert';
import { generalAlertSchema, type GeneralAlertSchema } from '../../zod/generalAlert.schema';
import { NotificationSettings } from './NotificationSettings';
import { ThresholdForm } from './ThresholdForm';

interface EditAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: GeneralAlertsPayload;
}

const LABELS = {
  alertSettings: 'Alert Settings',
  description:
    'Admin can set overall alerts to notify the Admin, group managers, and members via email in real time when spending exceeds configured thresholds.',
  thresholds: 'Thresholds',
  thresholdRule: 'You can set up to 3 thresholds. Allowed values: 1~1000',
  cancel: 'cancel',
  save: 'Save',
  close: 'close',
};

export const EditAlertDialog = ({
  isOpen,
  onClose,
  defaultValues,
}: EditAlertDialogProps) => {
  const postGeneralAlertsMutation = usePostGeneralAlerts();

  const formMethods = useForm<GeneralAlertSchema>({
    mode: 'onChange',
    resolver: zodResolver(generalAlertSchema),
    defaultValues,
  });

  const handleResetForm = () => {
    formMethods.reset(defaultValues);
  };

  const handleGeneralAlertSubmit: SubmitHandler<GeneralAlertSchema> = async () => {
    const data = formMethods.getValues();
    const formattedData: GeneralAlertsPayload = isEmpty(data.thresholds)
      ? formDefaultValues
      : {
          thresholds: data.thresholds.filter(
            (threshold): threshold is number => threshold !== null
          ),
          notification: data.notification,
        };

    await postGeneralAlertsMutation.mutateAsync(formattedData);

    onClose();
  };

  const hasError = !!Object.values(formMethods.formState.errors).length;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { minWidth: 700, px: 6, py: 4 },
        },
        transition: {
          onEntering: handleResetForm,
          onExited: handleResetForm,
        },
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 6 }}>
        <HStack alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{LABELS.alertSettings}</Typography>
          <IconButton aria-label={LABELS.close} size="large" color="default" onClick={onClose}>
            <Icon name="close" sx={{ color: 'text.secondary' }} />
          </IconButton>
        </HStack>
      </DialogTitle>
      <FormProvider {...formMethods}>
        <VStack
          component="form"
          onSubmit={formMethods.handleSubmit(handleGeneralAlertSubmit)}
          sx={{ flex: 1, overflow: 'auto' }}
        >
          <DialogContent sx={{ p: 0 }}>
            <VStack gap={6}>
              <Typography>{LABELS.description}</Typography>
              <VStack gap={6} sx={{ overflow: 'auto' }}>
                <VStack gap={2}>
                  <Typography variant="h6">{LABELS.thresholds}</Typography>
                  <Typography color="text.secondary">{LABELS.thresholdRule}</Typography>
                </VStack>
                {/* Thresholds form */}
                <ThresholdForm />
                {/* Notification Settings */}
                <NotificationSettings />
              </VStack>
            </VStack>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', mt: 6 }}>
            <Button onClick={onClose} variant="outlined">
              {LABELS.cancel}
            </Button>
            <Button
              type="submit"
              disabled={hasError || postGeneralAlertsMutation.isPending}
              isLoading={postGeneralAlertsMutation.isPending}
            >
              {LABELS.save}
            </Button>
          </DialogActions>
        </VStack>
      </FormProvider>
    </Dialog>
  );
};
