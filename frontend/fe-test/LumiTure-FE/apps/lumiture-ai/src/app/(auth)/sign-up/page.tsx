'use client';

import NextLink from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { sendGAEvent } from '@next/third-parties/google';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';
import { useToggle } from '@shared/hooks';

import CountrySelect from '@components/CountrySelect';
import { PrivacyPolicyDialog } from '@components/dialog/PrivacyAndTermOfUse/PrivacyPolicyDialog';
import { TermOfUseDialog } from '@components/dialog/PrivacyAndTermOfUse/TermOfUseDialog';
import AuthFormWrapper from '@components/layout/auth/AuthFormWrapper';
import { AUTH_PATHS, ERROR_CODES, EVENT } from '@constants';
import { usePostSignUp, type PostSignUpPayload } from '@hooks-api';
import { ApiError } from '@utils';

import { BASE_FIELD_ATTRS, FIELD_LABELS, FIELD_NAMES, FIELD_PLACEHOLDERS } from '../constants';
import signUpFormSchema from './form-schema';

export default function SignUp() {
  const [
    isPrivacyPolicyOpen,
    { handleOpen: handlePrivacyPolicyOpen, handleClose: handlePrivacyPolicyClose },
  ] = useToggle();
  const [isTosOpen, { handleOpen: handleTosOpen, handleClose: handleTosClose }] = useToggle();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSignUpPayload>({
    mode: 'onChange',
    defaultValues: {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        isActive: false,
      },
      organization: {
        businessName: '',
        businessPhone: '',
        phoneExtension: '',
        country: 'SG',
        state: '',
        zipCode: '',
        city: '',
        streetAddress: '',
      },
    },
    resolver: zodResolver(signUpFormSchema),
  });

  const signUpMutation = usePostSignUp();

  const handleSignUpSubmit: SubmitHandler<PostSignUpPayload> = async (data) => {
    // * Here you would typically send the data to your backend
    try {
      await signUpMutation.mutateAsync(data);
      sendGAEvent('event', EVENT.SIGN_UP);
    } catch (error) {
      // * Leave empty because we let react query handle the error
      if (error instanceof ApiError && error.data?.code === ERROR_CODES.DUPLICATE_EMAIL.key) {
        setError('user.email', {
          message: ERROR_CODES.DUPLICATE_EMAIL.message,
        });
      }
    }
  };

  return (
    <>
      <AuthFormWrapper
        title="Sign up to continue"
        desc="Just a few quick things to get started."
        onSubmit={handleSubmit(handleSignUpSubmit)}
      >
        <Grid container columnSpacing={2}>
          {/* First Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name={`user.${FIELD_NAMES.FIRST_NAME}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  autoFocus
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.FIRST_NAME}
                  id={FIELD_NAMES.FIRST_NAME}
                  placeholder={FIELD_PLACEHOLDERS.FIRST_NAME}
                  error={fieldState.invalid}
                  helperText={errors.user?.firstName?.message}
                />
              )}
            />
          </Grid>
          {/* Last Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name={`user.${FIELD_NAMES.LAST_NAME}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.LAST_NAME}
                  id={FIELD_NAMES.LAST_NAME}
                  placeholder={FIELD_PLACEHOLDERS.LAST_NAME}
                  error={fieldState.invalid}
                  helperText={errors.user?.lastName?.message}
                />
              )}
            />
          </Grid>
          {/* Email */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name={`user.${FIELD_NAMES.EMAIL}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.EMAIL}
                  id={FIELD_NAMES.EMAIL}
                  placeholder={FIELD_PLACEHOLDERS.EMAIL}
                  error={fieldState.invalid}
                  helperText={errors.user?.email?.message}
                />
              )}
            />
          </Grid>
          {/* Business Name */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name={`organization.${FIELD_NAMES.BUSINESS_NAME}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.BUSINESS_NAME}
                  id={FIELD_NAMES.BUSINESS_NAME}
                  placeholder={FIELD_PLACEHOLDERS.BUSINESS_NAME}
                  error={fieldState.invalid}
                  helperText={errors.organization?.businessName?.message}
                />
              )}
            />
          </Grid>
          {/* Business Phone */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Controller
              name={`organization.${FIELD_NAMES.BUSINESS_PHONE}`}
              control={control}
              render={({ field, fieldState }) => (
                <MuiTelInput
                  {...field}
                  {...{ ...BASE_FIELD_ATTRS, slotProps: undefined }}
                  label={FIELD_LABELS.BUSINESS_PHONE}
                  id={FIELD_NAMES.BUSINESS_PHONE}
                  placeholder={FIELD_PLACEHOLDERS.BUSINESS_PHONE}
                  error={fieldState.invalid}
                  helperText={errors.organization?.businessPhone?.message}
                  defaultCountry="SG"
                  forceCallingCode
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name={`organization.${FIELD_NAMES.PHONE_EXT}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  required={false}
                  label={FIELD_LABELS.PHONE_EXT}
                  id={FIELD_NAMES.PHONE_EXT}
                  placeholder={FIELD_PLACEHOLDERS.PHONE_EXT}
                  error={fieldState.invalid}
                  helperText={errors.organization?.phoneExtension?.message}
                />
              )}
            />
          </Grid>
          {/* Country / Region */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name={`organization.${FIELD_NAMES.COUNTRY}`}
              control={control}
              render={({ field }) => (
                <CountrySelect
                  size="large"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!errors.organization?.country}
                  helperText={errors.organization?.country?.message}
                />
              )}
            />
          </Grid>
          {/* State */}
          {/* <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name={`organization.${FIELD_NAMES.STATE}`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                {...BASE_FIELD_ATTRS}
                required={false}
                label={FIELD_LABELS.STATE}
                id={FIELD_NAMES.STATE}
                placeholder={FIELD_PLACEHOLDERS.STATE}
                error={fieldState.invalid}
                helperText={errors.organization?.state?.message}
              />
            )}
          />
        </Grid> */}
          {/* Zip Code */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name={`organization.${FIELD_NAMES.ZIP_CODE}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.ZIP_CODE}
                  id={FIELD_NAMES.ZIP_CODE}
                  placeholder={FIELD_PLACEHOLDERS.ZIP_CODE}
                  error={fieldState.invalid}
                  helperText={errors.organization?.zipCode?.message}
                />
              )}
            />
          </Grid>
          {/* City */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name={`organization.${FIELD_NAMES.CITY}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.CITY}
                  id={FIELD_NAMES.CITY}
                  placeholder={FIELD_PLACEHOLDERS.CITY}
                  error={fieldState.invalid}
                  helperText={errors.organization?.city?.message}
                />
              )}
            />
          </Grid>
          {/* Street Address */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name={`organization.${FIELD_NAMES.STREET_ADDR}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  {...BASE_FIELD_ATTRS}
                  label={FIELD_LABELS.STREET_ADDR}
                  id={FIELD_NAMES.STREET_ADDR}
                  placeholder={FIELD_PLACEHOLDERS.STREET_ADDR}
                  error={fieldState.invalid}
                  helperText={errors.organization?.streetAddress?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        {/* Submit */}
        <Button
          fullWidth
          type="submit"
          size="large"
          isLoading={signUpMutation.isPending}
          sx={{ mt: 4, mb: 2 }}
        >
          Sign up
        </Button>
        {/* Terms & Use, Privacy Policy */}
        <FormHelperText>
          By clicking the SIGN UP button you are agreeing to the LumiTure.ai{' '}
          <Typography variant="link" onClick={handleTosOpen} sx={{ px: 1 }}>
            Term of Use
          </Typography>
          and{' '}
          <Typography variant="link" onClick={handlePrivacyPolicyOpen} sx={{ px: 1 }}>
            Privacy Policy
          </Typography>
          .
        </FormHelperText>
        {/* Login */}
        <Stack direction="row" justifyContent="flex-end" alignItems="baseline" spacing={1}>
          <Typography variant="caption">Already have an account?</Typography>
          <NextLink href={AUTH_PATHS.login.pathname}>
            <Typography variant="linkBold" color="primary">
              Login
            </Typography>
          </NextLink>
        </Stack>
      </AuthFormWrapper>
      <PrivacyPolicyDialog isOpen={isPrivacyPolicyOpen} onClose={handlePrivacyPolicyClose} />
      <TermOfUseDialog isOpen={isTosOpen} onClose={handleTosClose} />
    </>
  );
}
