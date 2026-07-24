import { useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, FormProvider } from 'react-hook-form';

import { Button, Icon, Switch } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import {
  anomalyDetectionSettingsQueryKey,
  useUpdateAnomalyDetectionSettings,
  type AnomalyDetectionSettings,
} from '@hooks-api';

import { NotificationSettingFieldNames, Sensitivity } from '../../constants';
import useAnomalyAlertSettingsForm, {
  type ValidatedAnomalyAlertSettingsData,
} from '../../hooks/useAnomalyAlertSettingsForm';
import { NotificationSettings } from './NotificationSettings';

interface AnomalySettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: Omit<AnomalyDetectionSettings, 'availableActions'>;
}

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  p: 0,
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
  padding: 0,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  marginTop: theme.spacing(4),
  '& .MuiButton-root': {
    width: 100,
    height: 36,
  },
}));

const LABELS = {
  title: 'Anomaly Alert Settings',
  description:
    'Admin can set anomaly alerts to notify the Admin, group managers, and members via email when there’s any anomaly detected.',
  detection: {
    title: 'Detection',
    switch: {
      on: 'ON',
      off: 'OFF',
    },
  },
  sensitivity: {
    title: 'Detection Sensitivity',
    options: {
      [Sensitivity.Low]: 'Low',
      [Sensitivity.Medium]: 'Medium',
      [Sensitivity.High]: 'High',
    },
    description:
      'You can set the sensitivity to trigger the alert. A higher sensitivity level means the system is more vigilant and will react to even minor changes in spending patterns.',
  },
  buttons: {
    cancel: 'Cancel',
    save: 'Save',
  },
};

const getMappedFormValues = (data: ValidatedAnomalyAlertSettingsData) => {
  if (!data.detection) {
    return {
      [NotificationSettingFieldNames.detection]: false,
    };
  }
  return data;
};

export function AnomalySettingsDialog({ data, isOpen, onClose }: AnomalySettingsDialogProps) {
  const queryClient = useQueryClient();
  const updateAnomalyAlertSettings = useUpdateAnomalyDetectionSettings({
    onSuccess: () => {
      popSuccessToast({ description: 'Alert settings updated successfully.' });
      queryClient.invalidateQueries({ queryKey: anomalyDetectionSettingsQueryKey() });
    },
    onError: () => {
      popErrorToast({
        description: 'Unable to update alert. Please try again later.',
      });
    },
  });
  const formMethods = useAnomalyAlertSettingsForm({
    defaultValues: {
      ...data,
    },
  });
  const { control, watch, reset } = formMethods;

  const handleClose = () => {
    reset();
    onClose();
  };

  const shouldDisableNotificationSettings = !watch(NotificationSettingFieldNames.detection);

  const submitHandler = async (data: ValidatedAnomalyAlertSettingsData) => {
    try {
      const mappedFormValues = getMappedFormValues(data);

      await updateAnomalyAlertSettings.mutateAsync(mappedFormValues);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { px: 8, py: 6 } }} open={isOpen} onClose={handleClose}>
      {/* header */}
      <StyledDialogTitle>
        <Typography variant="h4">{LABELS.title}</Typography>
        <IconButton aria-label="close" size="large" color="default" onClick={handleClose}>
          <Icon name="close" sx={{ color: 'text.secondary' }} />
        </IconButton>
      </StyledDialogTitle>
      <Typography variant="caption" sx={{ mb: 6 }}>
        {LABELS.description}
      </Typography>

      <FormProvider {...formMethods}>
        <Stack component="form" onSubmit={formMethods.handleSubmit(submitHandler)}>
          <StyledDialogContent>
            {/* detection */}
            <Stack gap={2}>
              <Typography variant="captionBold" color="primary.main">
                {LABELS.detection.title}
              </Typography>
              <FormControl sx={{ width: 'fit-content' }}>
                <Controller
                  name={NotificationSettingFieldNames.detection}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label={field.value ? LABELS.detection.switch.on : LABELS.detection.switch.off}
                      checked={field.value}
                      {...field}
                    />
                  )}
                />
              </FormControl>
            </Stack>

            {/* detection sensitivity */}
            <Stack gap={2}>
              <Typography variant="captionBold" color="primary.main">
                {LABELS.sensitivity.title}
              </Typography>
              <FormControl sx={{ width: 'fit-content' }}>
                <Controller
                  name={NotificationSettingFieldNames.sensitivity}
                  control={control}
                  render={({ field }) => (
                    <Select
                      sx={{ width: 240 }}
                      disabled={shouldDisableNotificationSettings}
                      {...field}
                    >
                      {(
                        Object.values(Sensitivity).filter(
                          (value) => typeof value === 'number'
                        ) as Sensitivity[]
                      ).map((option) => (
                        <MenuItem key={option} value={option}>
                          {LABELS.sensitivity.options[option]}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{LABELS.sensitivity.description}</FormHelperText>
              </FormControl>
            </Stack>

            {/* notification settings */}
            <NotificationSettings disabled={shouldDisableNotificationSettings} />
          </StyledDialogContent>

          {/* action buttons */}
          <StyledDialogActions>
            <Button variant="outlined" onClick={handleClose}>
              {LABELS.buttons.cancel}
            </Button>
            <Button type="submit" isLoading={updateAnomalyAlertSettings.isPending}>
              {LABELS.buttons.save}
            </Button>
          </StyledDialogActions>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
