'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@lumiture-ui';

import { ErrorView } from '@app/(auth)/components/ErrorView';
import PwdFieldEndIcon from '@app/(auth)/components/PwdFieldEndIcon';
import PwdRuleListItem from '@app/(auth)/components/PwdRuleListItem';
import { pwdFormSchema } from '@app/(auth)/form-schemas';
import AuthFormWrapper from '@components/layout/auth/AuthFormWrapper';
import { AUTH_PATHS } from '@constants';
import { useGetVerifiedUser, usePostResetPwd, type PostResetPwdPayload } from '@hooks-api';

import {
  BASE_FIELD_ATTRS,
  FIELD_LABELS,
  FIELD_NAMES,
  FIELD_PLACEHOLDERS,
  PWD_RULES,
} from '../constants';

const { slotProps: BASE_SLOT_PROPS, ...REST_BASE_FIELD_ATTRS } = BASE_FIELD_ATTRS;

export default function ResetPwd() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const action = searchParams.get('action') || '';

  const [showResetPwd, setShowResetPwd] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);

  const verifiedUserQuery = useGetVerifiedUser({ token, action });
  const ResetPwdMutation = usePostResetPwd();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostResetPwdPayload>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirm: '',
    },
    resolver: zodResolver(pwdFormSchema),
  });

  const handleShowResetPwd = () => setShowResetPwd(!showResetPwd);
  const handleShowPwdConfirm = () => setShowPwdConfirm(!showPwdConfirm);
  const handleResetPwdSubmit = (data: PostResetPwdPayload) => ResetPwdMutation.mutate(data);

  useEffect(() => {
    if (verifiedUserQuery.isSuccess && verifiedUserQuery.data.isActive) {
      setValue('email', verifiedUserQuery.data.email);
      setValue('firstName', verifiedUserQuery.data.firstName);
      setValue('lastName', verifiedUserQuery.data.lastName);
    }
  }, [verifiedUserQuery.isSuccess, setValue, verifiedUserQuery.data]);

  return (
    <AuthFormWrapper
      title="Reset Password"
      desc="Please reset your password."
      onSubmit={handleSubmit(handleResetPwdSubmit)}
      isLoading={verifiedUserQuery.isLoading}
      isError={verifiedUserQuery.isError}
    >
      {/* Success View */}
      {verifiedUserQuery.isSuccess ? (
        <>
          {/* Pwd */}
          <Controller
            name={FIELD_NAMES.PWD}
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                {...field}
                {...REST_BASE_FIELD_ATTRS}
                label={FIELD_LABELS.PWD}
                id={FIELD_NAMES.PWD}
                placeholder={FIELD_PLACEHOLDERS.PWD}
                type={showResetPwd ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  ...BASE_SLOT_PROPS,
                  input: {
                    size: 'large',
                    endAdornment: (
                      <PwdFieldEndIcon isVisible={showResetPwd} handleClick={handleShowResetPwd} />
                    ),
                  },
                }}
              />
            )}
          />
          {/* Confirm Pwd */}
          <Controller
            name={FIELD_NAMES.PWD_CONFIRM}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                {...REST_BASE_FIELD_ATTRS}
                label={FIELD_LABELS.PWD_CONFIRM}
                id={FIELD_NAMES.PWD_CONFIRM}
                placeholder={FIELD_PLACEHOLDERS.PWD_CONFIRM}
                type={showPwdConfirm ? 'text' : 'password'}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
                slotProps={{
                  ...BASE_SLOT_PROPS,
                  input: {
                    size: 'large',
                    endAdornment: (
                      <PwdFieldEndIcon
                        isVisible={showPwdConfirm}
                        handleClick={handleShowPwdConfirm}
                      />
                    ),
                  },
                }}
              />
            )}
          />
          {/* Pwd Rules */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Your password must have:
          </Typography>
          <List>
            {PWD_RULES.map((rule) => (
              <PwdRuleListItem key={rule.key} text={rule.text} />
            ))}
          </List>
          {/* Submit */}
          <Button
            fullWidth
            type="submit"
            size="large"
            isLoading={ResetPwdMutation.isPending}
            sx={{ mt: 2, mb: 1.5 }}
          >
            Reset password
          </Button>
        </>
      ) : null}
      {/* Error View */}
      {verifiedUserQuery.isError ? (
        <ErrorView
          message={`Please contact your admin or `}
          href={AUTH_PATHS.forgotPassword.pathname}
          linkText="Forgot password"
        />
      ) : null}
    </AuthFormWrapper>
  );
}
