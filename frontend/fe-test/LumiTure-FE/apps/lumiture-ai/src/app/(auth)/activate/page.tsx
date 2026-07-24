'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityIcon from '@mui/icons-material/VisibilityRounded';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@lumiture-ui';
import { useToggle } from '@shared/hooks';

import { ErrorView } from '@app/(auth)/components/ErrorView';
import { pwdFormSchema } from '@app/(auth)/form-schemas';
import { PrivacyPolicyDialog } from '@components/dialog/PrivacyAndTermOfUse/PrivacyPolicyDialog';
import AuthFormWrapper from '@components/layout/auth/AuthFormWrapper';
import { AUTH_PATHS } from '@constants';
import { useGetVerifiedUser, usePostActivate, type PostActivatePayload } from '@hooks-api';

import PwdRuleListItem from '../components/PwdRuleListItem';
import { PWD_RULES } from '../constants';

export default function Activate() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const action = searchParams.get('action') || '';

  const [
    isPrivacyPolicyOpen,
    { handleOpen: handlePrivacyPolicyOpen, handleClose: handlePrivacyPolicyClose },
  ] = useToggle();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const verifiedUserQuery = useGetVerifiedUser({ token, action });
  const activateMutation = usePostActivate();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PostActivatePayload>({
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

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);

  const handleActivateSubmit = (data: PostActivatePayload) => {
    activateMutation.mutate(data);
  };

  React.useEffect(() => {
    if (verifiedUserQuery.isSuccess && !verifiedUserQuery.data.isActive) {
      setValue('email', verifiedUserQuery.data.email);
      setValue('firstName', verifiedUserQuery.data.firstName);
      setValue('lastName', verifiedUserQuery.data.lastName);
    }
  }, [verifiedUserQuery.isSuccess, setValue, verifiedUserQuery.data]);

  return (
    <>
      <AuthFormWrapper
        title="Activate Account"
        desc=" Please set a password to activate your LumiTure.ai account."
        onSubmit={handleSubmit(handleActivateSubmit)}
        isLoading={verifiedUserQuery.isLoading}
        isError={verifiedUserQuery.isError}
      >
        {verifiedUserQuery.isSuccess ? (
          <>
            <Grid container columnSpacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      label="First Name"
                      id="firstName"
                      placeholder="Please enter your first name in English"
                      error={fieldState.invalid}
                      helperText={errors.firstName?.message}
                      autoFocus
                      size="small"
                      fullWidth
                      margin="normal"
                      disabled={!!verifiedUserQuery.data.firstName}
                      slotProps={{ input: { size: 'large' }, inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      label="Last Name"
                      id="lastName"
                      placeholder="Please enter your last name in English"
                      error={fieldState.invalid}
                      helperText={errors.lastName?.message}
                      size="small"
                      fullWidth
                      margin="normal"
                      disabled={!!verifiedUserQuery.data.lastName}
                      slotProps={{ input: { size: 'large' }, inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      margin="normal"
                      label="Set Password"
                      placeholder="Please enter your password"
                      size="small"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          size: 'large',
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                sx={{
                                  '& svg': {
                                    width: 20,
                                    height: 20,
                                  },
                                }}
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword}
                              >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="passwordConfirm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      margin="normal"
                      label="Confirm Password"
                      placeholder="Please enter your password again"
                      size="small"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      id="passwordConfirm"
                      error={!!errors.passwordConfirm}
                      helperText={errors.passwordConfirm?.message}
                      slotProps={{
                        input: {
                          size: 'large',
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                sx={{
                                  '& svg': {
                                    width: 20,
                                    height: 20,
                                  },
                                }}
                                aria-label="toggle password visibility"
                                onClick={handleShowPasswordConfirm}
                              >
                                {showPasswordConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* Pwd Rules */}
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Your password must have:
            </Typography>
            <List>
              {PWD_RULES.map((rule) => (
                <PwdRuleListItem key={rule.key} text={rule.text} />
              ))}
            </List>
            <Button
              fullWidth
              type="submit"
              size="large"
              isLoading={activateMutation.isPending}
              sx={{ mt: 4, mb: 1.5 }}
            >
              Activate Account
            </Button>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Typography variant="link" color="primary" onClick={handlePrivacyPolicyOpen}>
                Privacy Policy
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={2}>
                <Typography variant="caption">Already have an account?</Typography>
                <Link href={AUTH_PATHS.login.pathname}>
                  <Typography variant="linkBold" color="primary">
                    Login
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </>
        ) : null}
        {verifiedUserQuery.isError ? (
          <ErrorView
            message={`Please contact your admin or `}
            href={AUTH_PATHS.signUp.pathname}
            linkText="Sign up"
            errorIcon={<ErrorIcon color="error" fontSize="large" />}
          />
        ) : null}
      </AuthFormWrapper>
      <PrivacyPolicyDialog isOpen={isPrivacyPolicyOpen} onClose={handlePrivacyPolicyClose} />
    </>
  );
}
