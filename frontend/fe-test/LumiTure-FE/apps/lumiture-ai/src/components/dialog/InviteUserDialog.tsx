'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import type { InviteUserPayload } from '@hooks-api';

import { inviteUserFormSchema } from './form-schema';

const TEST_PREFIX = 'invite-user-dialog';

interface InviteUserDialogProps {
  open: boolean;
  isPending: boolean;
  isSubmitDisabled: boolean;
  isAdminGroup?: boolean;
  tierOneGroupId?: string;
  tierTwoGroupId?: string;
  handleClose: () => void;
  handleInviteUser: (data: InviteUserPayload) => Promise<void>;
  roleOptions: string[];
}

const InviteUserDialog = ({
  open,
  handleClose,
  handleInviteUser,
  isPending,
  isSubmitDisabled,
  isAdminGroup = false,
  tierOneGroupId,
  tierTwoGroupId,
  roleOptions,
}: InviteUserDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserPayload>({
    mode: 'onChange',
    defaultValues: {
      role: isAdminGroup ? 'admin' : 'member',
      userEmails: '',
    },
    resolver: zodResolver(inviteUserFormSchema),
  });

  const handleInviteUserSubmit: SubmitHandler<InviteUserPayload> = async (data) => {
    await handleInviteUser({ ...data, isAdminGroup, tierOneGroupId, tierTwoGroupId });
    reset();
  };
  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog
      onClose={handleDialogClose}
      onSubmit={handleSubmit(handleInviteUserSubmit)}
      open={open}
      slotProps={{
        paper: {
          component: 'form',
        },
      }}
    >
      <Stack direction="row" alignItems="center">
        <Typography variant="h4">Invite User</Typography>
        <IconButton
          aria-label="close"
          color="secondary"
          onClick={handleDialogClose}
          sx={{ ml: 'auto' }}
          data-testid={`${TEST_PREFIX}-close-button`}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent sx={{ py: 8 }}>
        {isAdminGroup ? null : (
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl
                required
                fullWidth
                size="small"
                margin="normal"
                error={fieldState.invalid}
              >
                <InputLabel id="role" shrink>
                  Role
                </InputLabel>
                <Select
                  labelId="role"
                  label="Role"
                  {...field}
                  data-testid={`${TEST_PREFIX}-role-select`}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={`invite-user-${option}`} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.invalid ? (
                  <FormHelperText>{errors.role?.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
        )}
        <Controller
          name="userEmails"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              required
              label="Email"
              id="user-emails"
              placeholder="Please enter the user's email address"
              error={fieldState.invalid}
              helperText={errors.userEmails?.message}
              autoFocus
              size="small"
              fullWidth
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              data-testid={`${TEST_PREFIX}-user-emails-input`}
            />
          )}
        />
        <FormHelperText>
          {`Use commas (",") as separators for adding multiple members.`}
        </FormHelperText>
        <FormHelperText>
          *If there are any newly registered members, please remind them to check their inbox for
          the account activation email.
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="borderless"
          onClick={handleDialogClose}
          data-testid={`${TEST_PREFIX}-cancel-button`}
        >
          cancel
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isSubmitDisabled}
          data-testid={`${TEST_PREFIX}-submit-button`}
        >
          Invite User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserDialog;
