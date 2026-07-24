import { Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Switch, type SwitchProps } from '@lumiture-ui';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';

type VirtualMachineSwitchFieldProps = SwitchProps & {
  fieldName:
    | 'criteria.virtualMachine.networkIOPS.enable'
    | 'criteria.virtualMachine.diskIOPS.enable';
  label: string;
};

export function VirtualMachineSwitchField({ fieldName, label }: VirtualMachineSwitchFieldProps) {
  const { control } = useFormContext<RightsizingSettingsFormData>();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Switch
          {...field}
          label={<Typography variant="h6">{label}</Typography>}
          checked={field.value}
        />
      )}
    />
  );
}
