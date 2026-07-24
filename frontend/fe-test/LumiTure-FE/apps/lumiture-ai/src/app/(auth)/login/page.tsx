'use client';

import { useState } from 'react';
import NextLink from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, TextField, Typography } from '@mui/material';
import { sendGAEvent } from '@next/third-parties/google';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import { SSOButtons } from '@app/(auth)/login/components/SSOButtons';
import UserNotInvitedErrorDialog from '@app/(auth)/login/components/UserNotInvitedErrorDialog';
import SelectUserRoleDialog from '@components/dialog/SelectUserRoleDialog';
import AuthFormWrapper from '@components/layout/auth/AuthFormWrapper';
import { AUTH_PATHS, EVENT } from '@constants';
import { usePostLogin, type PostLoginPayload } from '@hooks-api';
import { ApiError } from '@utils';

import PwdFieldEndIcon from '../components/PwdFieldEndIcon';
import { BASE_FIELD_ATTRS, FIELD_LABELS, FIELD_NAMES, FIELD_PLACEHOLDERS } from '../constants';
import loginFormSchema from './form-schema';
import { useHandleAfterLoginSuccess } from './hooks/useHandleAfterLoginSuccess';
import useHandleOAuthError from './hooks/useHandleOAuthError';

const { slotProps: BASE_SLOT_PROPS, ...REST_BASE_FIELD_ATTRS } = BASE_FIELD_ATTRS;

const LABELS = {
  title: 'Login to your Account',
  desc: 'Welcome back to LumiTure.ai',
  login: 'Login',
  forgotPassword: 'Forgot Password',
  noAccount: "Don't have an account",
  signUp: 'Sign Up',
};

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [openSelectUserRoleDialog, setOpenSelectUserRoleDialog] = useState(false);
  const [openNotInvitedDialog, setOpenNotInvitedDialog] = useState(false);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<PostLoginPayload>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginFormSchema),
  });
  const loginMutation = usePostLogin();

  const handleLoginSubmit: SubmitHandler<PostLoginPayload> = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      sendGAEvent('event', EVENT.LOGIN);
    } catch (error) {
      if (error instanceof ApiError) {
        setError('password', {
          message: error.message,
        });
      }
    }
  };

  const handleShowPwd = () => setShowPwd(!showPwd);

  useHandleOAuthError({ setOpenNotInvitedDialog });
  useHandleAfterLoginSuccess({ setOpenSelectUserRoleDialog });

  return (
    <>
      <AuthFormWrapper
        title={LABELS.title}
        desc={LABELS.desc}
        onSubmit={handleSubmit(handleLoginSubmit)}
      >
        {/* Email */}
        <Controller
          name={FIELD_NAMES.EMAIL}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              {...BASE_FIELD_ATTRS}
              required={false}
              label={FIELD_LABELS.EMAIL}
              id={FIELD_NAMES.EMAIL}
              placeholder={FIELD_PLACEHOLDERS.EMAIL}
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
        {/* Password */}
        <Controller
          name={FIELD_NAMES.PWD}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              {...REST_BASE_FIELD_ATTRS}
              required={false}
              label={FIELD_LABELS.PWD}
              id={FIELD_NAMES.PWD}
              placeholder={FIELD_PLACEHOLDERS.PWD}
              type={showPwd ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                ...BASE_SLOT_PROPS,
                input: {
                  size: 'large',
                  endAdornment: <PwdFieldEndIcon isVisible={showPwd} handleClick={handleShowPwd} />,
                },
              }}
            />
          )}
        />
        {/* Submit */}
        <Button
          fullWidth
          type="submit"
          size="large"
          isLoading={loginMutation.isPending}
          sx={{ mt: 4, mb: 1.5 }}
        >
          {LABELS.login}
        </Button>

        <SSOButtons />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Forget Pwd */}
          <NextLink href={AUTH_PATHS.forgotPassword.pathname}>
            <Typography variant="link" color="primary">
              {LABELS.forgotPassword}
            </Typography>
          </NextLink>
          {/* Sign up */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption">{LABELS.noAccount}</Typography>
            <NextLink href={AUTH_PATHS.signUp.pathname}>
              <Typography variant="link" color="primary" sx={{ fontWeight: 'bold' }}>
                {LABELS.signUp}
              </Typography>
            </NextLink>
          </Stack>
        </Stack>
      </AuthFormWrapper>

      {openSelectUserRoleDialog && (
        <SelectUserRoleDialog
          open={openSelectUserRoleDialog}
          onClose={() => setOpenSelectUserRoleDialog(false)}
          canCancel={false}
        />
      )}

      {openNotInvitedDialog && (
        <UserNotInvitedErrorDialog
          open={openNotInvitedDialog}
          onClose={() => setOpenNotInvitedDialog(false)}
        />
      )}
    </>
  );
}
