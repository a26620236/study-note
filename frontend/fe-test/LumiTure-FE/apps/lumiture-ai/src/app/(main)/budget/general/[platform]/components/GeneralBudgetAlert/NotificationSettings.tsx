import {
  FormControlLabel,
  Switch as MuiSwitch,
  Tooltip,
  Typography,
  type SwitchProps as MuiSwitchProps,
} from '@mui/material';
import { alpha, type SxProps } from '@mui/material/styles';
import { get, isEmpty } from 'lodash-es';
import { Controller, useFormContext } from 'react-hook-form';

import { HStack, VStack } from '@lumiture-ui';

import { FORM_ID, FORM_LABELS } from '../../constants/generalAlert';
import type { FormGeneralAlerts } from '../../zod/generalAlert.schema';

interface SwitchProps extends MuiSwitchProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
}

const LABELS = {
  title: 'Notification Settings',
  description:
    'Each role will be able to receive alerts for budget exceedance at the configured threshold when its notifications are enabled.',
  disabledTooltip: 'Set threshold to adjust notification settings.',
};

const Switch = ({ label, disabled, checked, ...rest }: SwitchProps) => (
  <FormControlLabel
    control={<MuiSwitch disabled={disabled} checked={!disabled && checked} {...rest} />}
    label={label}
    sx={{ m: 0, gap: 2.5 }}
  />
);

const DisableOverlay = ({ disabled }: { disabled: boolean }) =>
  disabled ? (
    <Tooltip title={LABELS.disabledTooltip} followCursor placement="top">
      <VStack
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          bgcolor: alpha(theme.palette.common.white, 0.6),
          zIndex: 1,
          cursor: 'not-allowed',
        })}
      />
    </Tooltip>
  ) : null;

export const NotificationSettings = () => {
  const { control, getValues } = useFormContext<FormGeneralAlerts>();

  const { THRESHOLD, ...OTHER_FORM_ID } = FORM_ID;
  const thresholds = getValues(THRESHOLD);

  const isEmptyThresholds = isEmpty(thresholds);

  const getDepthIndexMap = (): Map<string, number> => {
    const depthLastPositions = new Map<string, number>();

    // e.g. ['ADMIN', 'T1', 'T1', 'T2', 'T2']
    const depthList = Object.keys(OTHER_FORM_ID).map((depth) => depth.split('_')[0]);

    depthList.forEach((value, index) => {
      depthLastPositions.set(value, index);
    });

    // e.g. Map {'ADMIN' => 0, 'T1' => 2, 'T2' => 4}
    return depthLastPositions;
  };

  const depthIndexMap = getDepthIndexMap();

  const getDividerStyle = (depthRole: string, depthRoleIndex: number): SxProps => {
    const dividerStyle = {
      pb: 4,
      borderBottom: '1px solid',
      borderColor: 'gray.borderLight',
      '&:last-of-type': { p: 0, border: 'unset' },
    };
    // e.g. T1_MANAGER -> T1
    const depth = depthRole.split('_')[0];

    return depthRoleIndex === depthIndexMap.get(depth) ? dividerStyle : {};
  };

  return (
    <VStack
      gap={4}
      sx={{
        position: 'relative',
        p: 6,
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'gray.borderLight',
      }}
    >
      <DisableOverlay disabled={isEmptyThresholds} />
      <VStack gap={2}>
        <Typography variant="h6">{LABELS.title}</Typography>
        <Typography color="text.secondary">{LABELS.description}</Typography>
      </VStack>
      {Object.entries(OTHER_FORM_ID).map(([depthRole, roles], depthRoleIndex) => (
        <VStack key={depthRole} gap={2} sx={{ ...getDividerStyle(depthRole, depthRoleIndex) }}>
          <Typography variant="captionBold">{get(FORM_LABELS, `${depthRole}.TITLE`)}</Typography>
          <HStack gap={4}>
            {Object.entries(roles).map(([role, name]) => (
              <Controller
                key={role}
                name={name}
                control={control}
                render={({ field: { value, ...others } }) => (
                  <Switch
                    label={get(FORM_LABELS, `${depthRole}.${role}`, '')}
                    checked={value}
                    disabled={isEmptyThresholds}
                    {...others}
                  />
                )}
              />
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
};
