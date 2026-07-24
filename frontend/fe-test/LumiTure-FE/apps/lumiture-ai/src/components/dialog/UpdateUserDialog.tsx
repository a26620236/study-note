import { useEffect } from 'react';

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
import Typography from '@mui/material/Typography';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import type { UpdateUserPayload } from '@hooks-api';

import { updateUserFormSchema } from './form-schema';
import { DIALOG_TYPES, type DialogVariantType } from './InfoDialog';

interface UpdateUserDialogProps {
  open: boolean;
  userId: string;
  userName: string;
  userRole: string;
  handleClose: () => void;
  isPending: boolean;
  isSubmitDisabled: boolean;
  variant: DialogVariantType;
  handleUpdateUser: (data: UpdateUserPayload) => Promise<void>;
  roleOptions: string[];
}

const TEST_PREFIX = 'update-user-dialog';

const UpdateUserDialog = ({
  open,
  userId,
  userName,
  userRole,
  handleUpdateUser,
  isPending,
  isSubmitDisabled,
  handleClose,
  variant,
  roleOptions,
}: UpdateUserDialogProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateUserPayload>({
    mode: 'onChange',
    defaultValues: {
      userId,
      role: userRole,
    },
    resolver: zodResolver(updateUserFormSchema),
  });
  const handleUpdateUserSubmit: SubmitHandler<UpdateUserPayload> = async (data) => {
    await handleUpdateUser({ ...data });
    reset();
  };
  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  useEffect(() => {
    if (open && userId && userRole) {
      setValue('userId', userId);
      setValue('role', userRole);
    }
  }, [open, userId, userRole, setValue]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack direction="row" alignItems="center">
        {DIALOG_TYPES[variant].icon}
        <Typography variant="h4" sx={{ ml: 2 }}>
          Edit User
        </Typography>
        <IconButton
          aria-label="close"
          color="secondary"
          onClick={handleClose}
          sx={{ ml: 'auto' }}
          data-testid={`${TEST_PREFIX}-close-button`}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent sx={{ py: 8 }}>
        <InputLabel id="userName" shrink>
          User Name
        </InputLabel>
        <Typography sx={{ mb: 2 }}>{userName || '--'}</Typography>
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl required fullWidth size="small" margin="normal" error={fieldState.invalid}>
              <InputLabel id="role" shrink>
                Role
              </InputLabel>
              <Select labelId="role" label="Role" {...field}>
                {roleOptions.map((option) => (
                  <MenuItem key={`update-user-${option}`} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {fieldState.invalid ? <FormHelperText>{errors.role?.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
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
          onClick={handleSubmit(handleUpdateUserSubmit)}
          disabled={isSubmitDisabled}
          isLoading={isPending}
          data-testid={`${TEST_PREFIX}-submit-button`}
        >
          Edit User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserDialog;
