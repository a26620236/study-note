'use client';

import NextLink from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import AuthFormWrapper from '@components/layout/auth/AuthFormWrapper';
import { AUTH_PATHS, ERROR_CODES } from '@constants';
import { usePostForgotPwd, type PostForgotPwdPayload } from '@hooks-api';
import { ApiError } from '@utils';

import { BASE_FIELD_ATTRS, FIELD_LABELS, FIELD_NAMES, FIELD_PLACEHOLDERS } from '../constants';
import forgotPwdFormSchema from './form-schema';

export default function ForgotPwd() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PostForgotPwdPayload>({
    resolver: zodResolver(forgotPwdFormSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const forgotPwdMutation = usePostForgotPwd();
  const handleForgotPwdSubmit: SubmitHandler<PostForgotPwdPayload> = async (data) => {
    try {
      await forgotPwdMutation.mutateAsync(data);
    } catch (error) {
      if (error instanceof ApiError && error.data?.code === ERROR_CODES.USER_NOT_FOUND.key) {
        setError('email', {
          message: ERROR_CODES.USER_NOT_FOUND.message,
        });
      }
    }
  };

  return (
    <AuthFormWrapper
      title="Forgot Password"
      desc="Please enter your registered email below to receive password reset instructions."
      onSubmit={handleSubmit(handleForgotPwdSubmit)}
    >
      {/* Email */}
      <Controller
        name={FIELD_NAMES.EMAIL}
        control={control}
        render={({ field }) => (
          <TextField
            autoFocus
            {...field}
            {...BASE_FIELD_ATTRS}
            required={false}
            label={FIELD_LABELS.EMAIL}
            id={FIELD_NAMES.EMAIL}
            placeholder={FIELD_PLACEHOLDERS.EMAIL}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      {/* Submit */}
      <Button
        fullWidth
        type="submit"
        size="large"
        isLoading={forgotPwdMutation.isPending}
        sx={{ mt: 4, mb: 1.5 }}
      >
        Send
      </Button>
      {/* login */}
      <NextLink href={AUTH_PATHS.login.pathname}>
        <Typography
          variant="linkBold"
          color="primary"
          sx={{ display: 'block', textAlign: 'right' }}
        >
          Back to Login
        </Typography>
      </NextLink>
    </AuthFormWrapper>
  );
}
