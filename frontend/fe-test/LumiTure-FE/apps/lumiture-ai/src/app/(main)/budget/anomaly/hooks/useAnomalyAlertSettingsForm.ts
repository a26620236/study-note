import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { NotificationSettingFieldNames, Roles, Sensitivity } from '../constants';

const roleSchema = z.object({
  [NotificationSettingFieldNames.alert]: z.boolean(),
});

const notificationSchema = z.object({
  [Roles.Admin]: roleSchema,
  [Roles.T1Manager]: roleSchema,
  [Roles.T1Member]: roleSchema,
  [Roles.T2Manager]: roleSchema,
  [Roles.T2Member]: roleSchema,
});

export const anomalyAlertSettingsSchema = z.object({
  [NotificationSettingFieldNames.detection]: z.boolean(),
  [NotificationSettingFieldNames.sensitivity]: z.union([
    z.literal(Sensitivity.Low),
    z.literal(Sensitivity.Medium),
    z.literal(Sensitivity.High),
  ]),
  [NotificationSettingFieldNames.notification]: notificationSchema,
});

export type AnomalyAlertSettingsFormValues = z.input<typeof anomalyAlertSettingsSchema>;
export type ValidatedAnomalyAlertSettingsData = z.output<typeof anomalyAlertSettingsSchema>;

interface UseAnomalyAlertSettingsFormProps {
  defaultValues: AnomalyAlertSettingsFormValues;
}

export default function useAnomalyAlertSettingsForm({
  defaultValues,
}: UseAnomalyAlertSettingsFormProps) {
  return useForm({
    defaultValues,
    resolver: zodResolver(anomalyAlertSettingsSchema),
  });
}
