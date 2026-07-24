'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';

import { popErrorToast, popSuccessToast } from '@shared/utils';

import { AUTH_PATHS } from '@constants';
import { api, ApiError } from '@utils';

import type {
  GetVerifiedUserResponse,
  PatchDefaultUserGroupPayload,
  PostActivatePayload,
  PostActivateResponse,
  PostForgotPwdPayload,
  PostForgotPwdResponse,
  PostLoginPayload,
  PostResetPwdPayload,
  PostResetPwdResponse,
  PostSignUpPayload,
  PostSignUpResponse,
} from './auth.type';

const useGetVerifiedUser = ({ token, action }: { token: string; action: string }) =>
  useQuery<GetVerifiedUserResponse, ApiError>({
    queryKey: ['auth', 'get-verified-user', token, action],
    queryFn: async () => {
      const data = await api.get<GetVerifiedUserResponse>('/user/verify_token', {
        params: { token, action },
      });
      return data;
    },
  });

const usePatchDefaultUserGroup = () => {
  const queryClient = useQueryClient();
  const { data: session, update } = useSession();
  return useMutation({
    mutationKey: ['auth', 'patch-default-user-group'],
    mutationFn: async (requestBody: PatchDefaultUserGroupPayload) => {
      const data = await api.patch('/user/default-role-group', {
        requestBody,
      });
      return data;
    },
    onSuccess: async () => {
      const updatedUser = await api.get<User>('/user/profile');

      if (session) {
        await update({
          ...session.user,
          ...updatedUser,
        });
      }

      popSuccessToast({
        description: 'Default user group updated successfully.',
      });

      queryClient.invalidateQueries({ queryKey: ['auth', 'get-user-groups'] });
    },
    onError: (error: ApiError) => {
      popErrorToast({ description: error.message });
    },
  });
};

const usePostActivate = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['auth', 'activate'],
    mutationFn: async (requestBody: PostActivatePayload) => {
      const data = await api.post<PostActivateResponse>('/user/activate_account/', { requestBody });
      return data;
    },
    onSuccess: () => {
      popSuccessToast({
        description:
          'Your account has been activated successfully! Please login with your email and password.',
      });
      router.push(AUTH_PATHS.login.pathname);
    },
    onError: (error: ApiError) => {
      popErrorToast({ description: error.message });
    },
  });
};

const usePostLogin = () =>
  useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (requestBody: PostLoginPayload) => {
      const { email, password } = requestBody;
      const nextAuthResult = await signIn('credentials', { redirect: false, email, password });
      if (!nextAuthResult?.ok) {
        throw new ApiError(
          nextAuthResult?.status || 500,
          nextAuthResult?.error || `Incorrect credentials. Please verify and try again.`
        );
      }

      return nextAuthResult;
    },
    onError: (error: ApiError) => {
      console.error(error);
    },
  });

const usePostSignUp = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['auth', 'sign-up'],
    mutationFn: async (requestBody: PostSignUpPayload) => {
      const data = await api.post<PostSignUpResponse>('/register/', {
        requestBody,
      });
      return data;
    },
    onSuccess: () => {
      popSuccessToast({
        description: 'Email has been sent, please check your mail box to activate your account.',
        duration: 10000,
      });
      router.push(AUTH_PATHS.login.pathname);
    },
    onError: (error: ApiError) => {
      popErrorToast({ description: error.message });
    },
  });
};

const usePostForgotPwd = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: async (requestBody: PostForgotPwdPayload) => {
      const data = await api.post<PostForgotPwdResponse>('/user/forgot_password/', {
        requestBody,
      });
      return data;
    },
    onSuccess: () => {
      popSuccessToast({
        description: 'Email has been sent, please check your mail box to reset your password.',
        duration: 10000,
      });
      router.push(AUTH_PATHS.login.pathname);
    },
    onError: (error: Error) => {
      popErrorToast({ description: error.message });
    },
  });
};

const usePostResetPwd = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['auth', 'reset-password'],
    mutationFn: async (requestBody: PostResetPwdPayload) => {
      const data = await api.post<PostResetPwdResponse>('/user/reset_password/', {
        requestBody,
      });
      return data;
    },
    onSuccess: () => {
      popSuccessToast({
        description: 'Password reset successfully! Please try to login with your new password.',
      });
      router.push(AUTH_PATHS.login.pathname);
    },
    onError: (error: Error) => {
      popErrorToast({ description: error.message });
    },
  });
};

export {
  usePostSignUp,
  usePostLogin,
  usePostActivate,
  useGetVerifiedUser,
  usePatchDefaultUserGroup,
  usePostForgotPwd,
  usePostResetPwd,
};
