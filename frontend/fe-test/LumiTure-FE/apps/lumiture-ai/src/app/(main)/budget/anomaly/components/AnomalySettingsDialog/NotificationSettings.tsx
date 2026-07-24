import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext } from 'react-hook-form';

import { Switch } from '@lumiture-ui';

import { NotificationSettingFieldNames, Roles } from '../../constants';

interface NotificationSettingsProps {
  disabled: boolean;
}

const StyledStack = styled(Stack)(({ theme }) => ({
  position: 'relative',
  gap: theme.spacing(4),
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.gray.borderLight}`,
}));

const LABELS = {
  title: 'Notification Settings',
  description:
    'Each role will be able to receive alerts for spending anomalies at the configured threshold when its notifications are enabled.',
  roles: {
    [Roles.Admin]: 'Admin',
    [Roles.T1Manager]: 'Tier 1 Manager',
    [Roles.T1Member]: 'Tier 1 Member',
    [Roles.T2Manager]: 'Tier 2 Manager',
    [Roles.T2Member]: 'Tier 2 Member',
  },
  switch: {
    on: 'ON',
    off: 'OFF',
  },
};

export function NotificationSettings({ disabled }: NotificationSettingsProps) {
  const { control } = useFormContext();

  const getShouldShowDivider = (role: Roles) => role === Roles.Admin || role === Roles.T1Member;

  return (
    <StyledStack>
      <Stack gap={2}>
        <Typography variant="h6">{LABELS.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {LABELS.description}
        </Typography>
      </Stack>

      {/* notification settings fields */}
      {Object.values(Roles).map((role) => (
        <>
          <Stack gap={2} key={role}>
            <Typography variant="captionBold">{LABELS.roles[role]}</Typography>
            <Box sx={{ display: 'flex', gap: 16 }}>
              <Controller
                key={`${NotificationSettingFieldNames.notification}.${role}.${NotificationSettingFieldNames.alert}`}
                name={`${NotificationSettingFieldNames.notification}.${role}.${NotificationSettingFieldNames.alert}`}
                control={control}
                render={({ field: { value, ...others } }) => (
                  <Switch
                    label={value ? LABELS.switch.on : LABELS.switch.off}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    checked={value}
                    disabled={disabled}
                    {...others}
                  />
                )}
              />
            </Box>
          </Stack>
          {getShouldShowDivider(role) && <Divider />}
        </>
      ))}
    </StyledStack>
  );
}
