'use client';

import { useCallback, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import type { EditGroupPayload } from '@hooks-api';

import { EditGroupSchema } from './form-schema';

const TEST_PREFIX = 'edit-group-dialog';

interface EditGroupDialogProps {
  isOpen: boolean;
  defaultValues?: Pick<EditGroupPayload, 'groupName'> | null;
  isPending: boolean;
  handleClose: () => void;
  handleEditGroup: (data: EditGroupPayload) => Promise<void>;
}

const EditGroupDialog = ({
  isOpen,
  defaultValues,
  isPending,
  handleClose,
  handleEditGroup,
}: EditGroupDialogProps) => {
  const actionWording = defaultValues ? 'Edit' : 'Create';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditGroupPayload>({
    mode: 'onChange',
    resolver: zodResolver(EditGroupSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      reset({ groupName: defaultValues.groupName || '' });
    }
  }, [defaultValues, reset]);

  const handleDialogClose = useCallback(() => {
    reset({ groupName: '' });
    handleClose();
  }, [reset, handleClose]);

  const handleEditGroupSubmit: SubmitHandler<EditGroupPayload> = async (data) =>
    await handleEditGroup(data);

  return (
    <Dialog
      open={isOpen}
      onClose={handleDialogClose}
      onSubmit={handleSubmit(handleEditGroupSubmit)}
      slotProps={{
        paper: {
          component: 'form',
        },
      }}
      disableRestoreFocus
    >
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Typography variant="h4">{`${actionWording} Group`}</Typography>
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
      <DialogContent>
        <Controller
          name="groupName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              required
              label="Group Name"
              id="groupName"
              placeholder="Please enter the group name"
              error={fieldState.invalid}
              helperText={errors.groupName?.message}
              autoFocus
              size="small"
              fullWidth
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              data-testid={`${TEST_PREFIX}-group-name-input`}
            />
          )}
        />
        {defaultValues ? null : (
          <>
            <Controller
              name="managerEmails"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Manager Email"
                  id="managerEmails"
                  placeholder="Please enter the user's email address"
                  error={fieldState.invalid}
                  helperText={errors.managerEmails?.message}
                  autoFocus
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  data-testid={`${TEST_PREFIX}-manager-emails-input`}
                />
              )}
            />
            <FormHelperText>
              {`Use commas (",") as separators for adding multiple members.`}
            </FormHelperText>
            <FormHelperText>
              *If there are any newly registered members, please remind them to check their inbox
              for the account activation email.
            </FormHelperText>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="borderless"
          data-testid={`${TEST_PREFIX}-cancel-button`}
        >
          cancel
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending}
          data-testid={`${TEST_PREFIX}-submit-button`}
        >
          {`${actionWording} Group`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGroupDialog;
